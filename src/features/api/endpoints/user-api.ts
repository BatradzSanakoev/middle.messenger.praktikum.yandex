import { HTTPTransport } from '../httpTransport';
import type {
  ProfileData,
  PasswordData,
  UserResponse,
  SearchUser,
} from '../lib';

const userTransport = new HTTPTransport();

export class UserAPI {
  private transport = userTransport;

  profile(data: ProfileData): Promise<UserResponse> {
    return this.transport.put<UserResponse>('/user/profile', { data });
  }

  avatar(avatar: File): Promise<UserResponse> {
    const formData = new FormData();
    formData.append('avatar', avatar);
    return this.transport.put<UserResponse>('/user/profile/avatar', { data: formData });
  }

  password(data: PasswordData): Promise<unknown> {
    return this.transport.put('/user/password', { data });
  }

  get(id: number): Promise<UserResponse> {
    return this.transport.get<UserResponse>(`/user/${id}`);
  }

  search(data: { login: string }): Promise<SearchUser[]> {
    return this.transport.post<SearchUser[]>('/user/search', { data });
  }
}
