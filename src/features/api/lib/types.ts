export type PlainObject<T = unknown> = {
  [key: string]: T;
};

export type RequestData = Record<string, unknown> | FormData | string | number | boolean | null;

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
  response: unknown;
}

export interface AbortError extends BaseError {
  reason: "Request aborted";
}

export interface NetworkError extends BaseError {
  reason: "Network error";
}

export interface TimeoutError extends BaseError {
  reason: "Request timeout";
  timeout: number;
}

// --- API Types ---

export interface SignupRequest {
  [key: string]: unknown;
  first_name: string;
  second_name: string;
  login: string;
  email: string;
  phone: string;
  password: string;
}

export interface SigninRequest {
  [key: string]: unknown;
  login: string;
  password: string;
}

export interface ProfileData {
  [key: string]: unknown;
  first_name?: string;
  second_name?: string;
  display_name?: string;
  login?: string;
  email?: string;
  phone?: string;
}

export interface PasswordData {
  [key: string]: unknown;
  oldPassword: string;
  newPassword: string;
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
  [key: string]: unknown;
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
  role?: string;
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
