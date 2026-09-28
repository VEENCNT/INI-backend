export class UserSingleton {
  private static instance: UserSingleton;
  private readonly userId: number = 1;

  private constructor() {}

  public static getInstance(): UserSingleton {
    if (!UserSingleton.instance) {
      UserSingleton.instance = new UserSingleton();
    }
    return UserSingleton.instance;
  }

  public getUserId(): number {
    return this.userId;
  }
}

export const getCurrentUserId = (): number => {
  return UserSingleton.getInstance().getUserId();
};