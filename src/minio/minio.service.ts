import 'multer';
import { Injectable, OnModuleInit, InternalServerErrorException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as Minio from 'minio';
import * as crypto from 'crypto';
import * as path from 'path';

@Injectable()
export class MinioService {
  private minioClient: Minio.Client;
  private bucketName: string;

  constructor(private readonly configService: ConfigService) {
    this.bucketName = this.configService.get<string>('MINIO_BUCKET')!;

    this.minioClient = new Minio.Client({
      endPoint: this.configService.get<string>('MINIO_ENDPOINT')!,
      port: this.configService.get<number>('MINIO_PORT')!,
      useSSL: this.configService.get<string>('MINIO_USE_SSL')! === 'true',
      accessKey: this.configService.get<string>('MINIO_ACCESS_KEY')!,
      secretKey: this.configService.get<string>('MINIO_SECRET_KEY')!,
    });

    this.initializeBucket();
  }

  private async initializeBucket() {
    try {
      const exists = await this.minioClient.bucketExists(this.bucketName);
      if (!exists) {
        await this.minioClient.makeBucket(this.bucketName, 'us-east-1');
        console.log(`Бакет "${this.bucketName}" создан в MinIO`);
      }
    } catch (error) {
      console.error('Ошибка инициализации MinIO бакета:', error);
    }
  }

  async uploadFile(file: Express.Multer.File): Promise<string> {
    try {
      const ext = path.extname(file.originalname);
      const fileName = `${crypto.randomUUID()}${ext.toLowerCase()}`;
      
      await this.minioClient.putObject(
        this.bucketName,
        fileName,
        file.buffer,
        file.size,
        { 'Content-Type': file.mimetype }
      );

      const protocol = this.configService.get<string>('MINIO_USE_SSL') === 'true' ? 'https' : 'http';
      const endpoint = this.configService.get<string>('MINIO_ENDPOINT');
      const port = this.configService.get<number>('MINIO_PORT');
      
      return `${protocol}://${endpoint}:${port}/${this.bucketName}/${fileName}`;
    } catch (error) {
      throw new InternalServerErrorException('Ошибка при загрузке файла в MinIO');
    }
  }
}