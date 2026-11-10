import { HTTPTransport } from '../httpTransport';
import type {
  CreateChatData,
  ChatUser,
  ChatResponse,
  UnreadCountResponse,
} from '../lib';

const chatTransport = new HTTPTransport();

export class ChatAPI {
  private transport = chatTransport;

  get(): Promise<ChatResponse[]> {
    return this.transport.get<ChatResponse[]>('/chats');
  }

  create(data: CreateChatData): Promise<ChatResponse> {
    return this.transport.post<ChatResponse>('/chats', { data });
  }

  delete(data: { id: number }): Promise<unknown> {
    return this.transport.delete('/chats', { data });
  }

  getUsers(id: number): Promise<ChatUser[]> {
    return this.transport.get<ChatUser[]>(`/chats/${id}/users`);
  }

  getUnreadCount(id: number): Promise<UnreadCountResponse> {
    return this.transport.get<UnreadCountResponse>(`/chats/new/${id}`);
  }

  addUser(data: { users: number[]; chatId: number }): Promise<unknown> {
    return this.transport.put('/chats/users', { data });
  }

  removeUser(data: { users: number[]; chatId: number }): Promise<unknown> {
    return this.transport.delete('/chats/users', { data });
  }

  avatar(avatar: File): Promise<unknown> {
    const formData = new FormData();
    formData.append('avatar', avatar);
    return this.transport.put('/chats/avatar', { data: formData });
  }
}
