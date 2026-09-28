# Лабораторная работа №2

### 1. Таблица `users` (Пользователи)

| Поле | Тип | Ограничения | Описание |
| --- | --- | --- | --- |
| `user_id` | `INT` | `PK`, `AUTO_INCREMENT` | Уникальный идентификатор пользователя |
| `username` | `VARCHAR(50)` | `NOT NULL` | Отображаемое имя |
| `login` | `VARCHAR(50)` | `UNIQUE`, `NOT NULL` | Уникальный логин |
| `password_hash` | `VARCHAR(255)` | `NOT NULL` | Хэш пароля |

### 2. Таблица `biochemical_indicators` (Услуги / Биохимические показатели)

| Поле | Тип | Ограничения | Описание |
| --- | --- | --- | --- |
| `indicator_id` | `INT` | `PK`, `AUTO_INCREMENT` | Уникальный идентификатор показателя |
| `title` | `VARCHAR(100)` | `UNIQUE`, `NOT NULL` | Название показателя |
| `description` | `TEXT` | `NULLABLE` | Полное описание |
| `lower_reference_limit` | `NUMERIC(10,2)` | `NOT NULL` | Нижняя граница нормы |
| `upper_reference_limit` | `NUMERIC(10,2)` | `NOT NULL` | Верхняя граница нормы |
| `image_url` | `VARCHAR(255)` | `NOT NULL` | Ссылка на изображение в MinIO |
| `video_url` | `VARCHAR(255)` | `NOT NULL` | Ссылка на короткое видео в MinIO |
| `status` | `VARCHAR(20)` | `NOT NULL` | Статус записи (`CREATED`, `FORMED`, `DELETED`) |
| `creator_id` | `INT` | `FK -> users.user_id` | Идентификатор создателя |
| `created_at` | `TIMESTAMP` | `DEFAULT NOW()` | Дата и время создания черновика |
| `formed_at` | `TIMESTAMP` | `NULLABLE` | Дата и время публикации |

### 3. Таблица `likes` (Лайки)

| Поле | Тип | Ограничения | Описание |
| --- | --- | --- | --- |
| `like_id` | `INT` | `PK`, `AUTO_INCREMENT` | Идентификатор лайка |
| `user_id` | `INT` | `FK -> users.user_id` | Пользователь, поставивший лайк |
| `indicator_id` | `INT` | `FK -> biochemical_indicators.indicator_id` | Услуга, которой поставлен лайк |

> **Уникальный индекс:** `UNIQUE(user_id, indicator_id)` предотвращает повторные лайки от одного пользователя.

---

## Таблица HTTP API Эндпоинтов

| № | Метод | URL Эндпоинт | Параметры / Тело | HTTP Код | Описание |
| --- | --- | --- | --- | --- | --- |
| **1** | `GET` | `/api/biochemical-indicators` | Query: `indicatorConcentration` | `200 OK` | Список опубликованных услуг с фильтрацией по концентрации и признаком `isOwner`.|
| **2** | `POST` | `/api/biochemical-indicators/draft` | `multipart/form-data`: `title`, `description`, `lowerReferenceLimit`, `upperReferenceLimit`, `image`, `video` | `201 Created` | Создание или обновление черновика. Загружает файлы в MinIO и генерирует ссылки.|
| **3** | `GET` | `/api/biochemical-indicators/draft` | — | `200 OK` | Получение черновика текущего пользователя. Возвращает объект услуги или дефолтную структуру со значениями `null`/`""`.|
| **4** | `PUT` | `/api/biochemical-indicators/draft/publish` | — | `200 OK` | Публикация черновика (перевод из статуса `CREATED` в `FORMED` и фиксирование `formedAt`).|
| **5** | `GET` | `/api/biochemical-indicators/feed` | — | `200 OK` | Получение первого элемента ленты публикаций.|
| **6** | `GET` | `/api/biochemical-indicators/feed` | Query: `indicatorId`, `next=true` | `200 OK` | Пагинация ленты: получение следующего опубликованного элемента относительно `indicatorId`.|
| **7** | `POST` | `/api/biochemical-indicators/:id/like` | Path: `id` и Body: `{ "like": 1 }` или `{ "like": 0 }` | `201 Created` | Установка (`1`) или снятие (`0`) лайка текущим пользователем.|
| **8** | `DELETE` | `/api/biochemical-indicators/:id` | Path: `id` | `200 OK` | Мягкое удаление (Soft Delete). Доступно только создателю услуги.|
| **9** | `POST` | `/api/users/register` | Body: `{ "username", "login", "passwordHash" }` | `201 Created` | Регистрация нового пользователя.|
| **10** | `POST` | `/api/auth/login` | — | `201 Created` | Аутентификация (заглушка).|
| **11** | `POST` | `/api/auth/logout` | — | `201 Created` | Деавторизация (заглушка).|