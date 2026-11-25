import { HTTPTransport } from "../httpTransport";
import type { SignupRequest, SigninRequest, UserResponse } from "../lib";

const authTransport = new HTTPTransport();

export class AuthAPI {
  private transport = authTransport;

  /**
   * POST /auth/signup — регистрация.
   * Возвращает { id }, НЕ полный объект пользователя.
   * После вызова нужно сделать getUser() для получения полных данных.
   */
  signup(data: SignupRequest): Promise<unknown> {
    return this.transport.post("/auth/signup", { data });
  }

  /**
   * POST /auth/signin — авторизация.
   * Возвращает строку "OK", НЕ пользователя.
   * После вызова нужно сделать getUser() для получения данных.
   */
  signin(data: SigninRequest): Promise<unknown> {
    return this.transport.post("/auth/signin", { data });
  }

  /**
   * GET /auth/user — информация о текущем пользователе (по cookie).
   * Возвращает полный объект UserResponse.
   */
  getUser(): Promise<UserResponse> {
    return this.transport.get<UserResponse>("/auth/user");
  }

  /**
   * POST /auth/logout — выход из системы.
   */
  logout(): Promise<void> {
    return this.transport.post<void>("/auth/logout");
  }
}
