import { store } from "@/shared/utils";
import { UserAPI } from "../api";

import type { UserResponse, SearchUser, ProfileData, PasswordData } from "../api";

const userAPI = new UserAPI();

/**
 * Контроллер пользователя — управление профилем, паролем, аватаром, поиском.
 */
export class UserController {
  /**
   * Получение профиля пользователя.
   * - Запрашивает данные по ID
   * - Сохраняет в Store
   */
  static async getProfile(userId: number): Promise<UserResponse> {
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
  static async updatePassword(data: PasswordData): Promise<unknown> {
    return userAPI.password(data);
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
