export type PlainObject<T = unknown> = {
  [key: string]: T;
};

export type RequestData = Record<string, unknown> | Record<string, any> | FormData | string | number | boolean | null;

export interface RequestOptions {
  headers?: Record<string, string>;
  method?: string;
  data?: RequestData;
  responseType?: XMLHttpRequestResponseType;
  timeout?: number;
}

export interface BaseError {
  request: XMLHttpRequest;
}

export interface ApiError extends BaseError {
  status: number;
  statusText: string;
  response: string;
}

export interface AbortError extends BaseError {
  reason: 'Request aborted';
}

export interface NetworkError extends BaseError {
  reason: 'Network error';
}

export interface TimeoutError extends BaseError {
  reason: 'Request timeout';
  timeout: number;
}

// --- API Types ---

export interface SignupRequest {
  first_name: string;
  second_name: string;
  login: string;
  email: string;
  phone: string;
  password: string;
}

export interface SigninRequest {
  login: string;
  password: string;
}

export interface ProfileData {
  first_name?: string;
  second_name?: string;
  display_name?: string;
  login?: string;
  email?: string;
  phone?: string;
}

export interface PasswordData {
  old_password: string;
  new_password: string;
}

export interface UserResponse {
  id: number;
  first_name: string;
  second_name: string;
  login: string;
  email: string;
  phone: string;
  display_name: string;
  avatar: string;
}

export interface SearchUser {
  id: number;
  first_name: string;
  second_name: string;
  login: string;
  email: string;
  phone: string;
  display_name: string;
  avatar: string;
}

export interface CreateChatData {
  title: string;
}

export interface ChatUser {
  id: number;
  first_name: string;
  second_name: string;
  login: string;
  email: string;
  phone: string;
  display_name: string;
  avatar: string;
}

export interface ChatResponse {
  id: number;
  title: string;
  avatar: string;
  user_id: number;
}

export interface UnreadCountResponse {
  chats: {
    id: number;
    unread_count: number;
  }[];
}
