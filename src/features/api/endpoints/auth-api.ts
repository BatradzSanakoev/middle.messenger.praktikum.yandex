import { HTTPTransport } from '../httpTransport';
import type {
  SignupRequest,
  SigninRequest,
  UserResponse,
} from '../lib';

const authTransport = new HTTPTransport();

export class AuthAPI {
  private transport = authTransport;

  signup(data: SignupRequest): Promise<UserResponse> {
    return this.transport.post<UserResponse>('/auth/signup', { data });
  }

  signin(data: SigninRequest): Promise<UserResponse> {
    return this.transport.post<UserResponse>('/auth/signin', { data });
  }

  getUser(): Promise<UserResponse> {
    return this.transport.get<UserResponse>('/auth/user');
  }

  logout(): Promise<void> {
    return this.transport.post<void>('/auth/logout');
  }
}
