import { store } from "@/shared/utils";
import { UserAPI, AuthAPI } from "../api";

import type { UserResponse, SearchUser, ProfileData, PasswordData } from "../api";

const userAPI = new UserAPI();
const authAPI = new AuthAPI();

/**
 * Контроллер пользователя — управление профилем, паролем, аватаром, поиском.
 */
export class UserController {
  /**
   * Получение профиля текущего пользователя.
   * - Запрашивает данные через /auth/user (без ID)
   * - Сохраняет в Store
   */
  static async getProfile(): Promise<UserResponse> {
    const user = await authAPI.getUser();
    store.setState("user", user);
    return user;
  }

  /**
   * Получение профиля пользователя по ID.
   * - Запрашивает данные по ID
   * - Сохраняет в Store
   */
  static async getProfileById(userId: number): Promise<UserResponse> {
    const user = await userAPI.get(userId);
    store.setState("user", user);
    return user;
  }

  /**
   * Обновление данных профиля.
   * - Отправляет данные на сервер
   * - Обновляет Store с новыми данными
   */
  static async updateProfile(data: ProfileData): Promise<UserResponse> {
    const user = await userAPI.profile(data);
    store.setState("user", user);
    return user;
  }

  /**
   * Обновление пароля.
   * - Отправляет старый и новый пароль
   * - Возвращает результат (без изменения Store)
   */
  static async updatePassword(data: { oldPassword: string; newPassword: string }): Promise<unknown> {
    return userAPI.password(data as PasswordData);
  }

  /**
   * Обновление аватара.
   * - Отправляет файл на сервер
   * - Обновляет Store с новым аватаром
   */
  static async updateAvatar(avatar: File): Promise<UserResponse> {
    const user = await userAPI.avatar(avatar);
    store.setState("user", user);
    return user;
  }

  /**
   * Поиск пользователей.
   * - Ищет по логину
   * - Возвращает массив найденных пользователей
   */
  static async searchUsers(login: string): Promise<SearchUser[]> {
    return userAPI.search({ login });
  }
}
