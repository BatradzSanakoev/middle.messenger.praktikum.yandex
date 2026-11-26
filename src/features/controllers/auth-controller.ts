import { AuthAPI } from "../api";
import { store } from "@shared/utils";
import { Router } from "../router";

import type { UserResponse } from "../api";

const authAPI = new AuthAPI();

/**
 * Контроллер авторизации — управляет логикой входа, регистрации, выхода и проверки авторизации.
 * Не знает, как рисуются страницы, но знает про API, Store и Router.
 */
export class AuthController {
  /**
   * Авторизация пользователя.
   * - Выполняет запрос к API (возвращает "OK")
   * - Запрашивает пользователя через getUser()
   * - Сохраняет пользователя в Store
   * - Перенаправляет на мессенджер
   */
  static async signin(login: string, password: string): Promise<UserResponse> {
    await authAPI.signin({ login, password }); // "OK" — игнорируем
    const user = await authAPI.getUser(); // ← реальный объект
    store.setState("user", user);
    Router.getInstance().go("/messenger");
    return user;
  }

  /**
   * Регистрация нового пользователя.
   * - Выполняет запрос к API (возвращает {id})
   * - Запрашивает пользователя через getUser()
   * - Сохраняет пользователя в Store
   * - Перенаправляет на мессенджер
   */
  static async signup(data: {
    first_name: string;
    second_name: string;
    login: string;
    email: string;
    phone: string;
    password: string;
  }): Promise<UserResponse> {
    await authAPI.signup(data); // {id} — игнорируем
    const user = await authAPI.getUser(); // ← полный объект
    store.setState("user", user);
    Router.getInstance().go("/messenger");
    return user;
  }

  /**
   * Выход из системы.
   * - Выполняет запрос к API
   * - Очищает WebSocket и Store
   * - Перенаправляет на страницу входа
   */
  static async logout(): Promise<void> {
    try {
      await authAPI.logout();
    } catch {
      // Если API упал — всё равно чистим клиентское состояние,
      // пользователь ожидает выхода
    }
    store.setState("user", null);
    Router.getInstance().go("/");
  }

  /**
   * Проверка авторизации.
   * - Выполняет запрос к API для получения текущего пользователя
   * - Если авторизован — сохраняет в Store и возвращает пользователя
   * - Если не авторизован — устанавливает null в Store (без редиректа)
   *   Редирект обрабатывает Router guard (isProtected)
   */
  static async checkAuth(): Promise<UserResponse | null> {
    try {
      const user = await authAPI.getUser();
      store.setState("user", user);
      return user;
    } catch {
      store.setState("user", null); // ← явный null, никакого редиректа
      return null;
    }
  }
}
