// Типы сообщений, отправляемых клиентом на сервер
export interface WSMessage {
  content?: string;
  type: "message" | "file" | "sticker" | "get old" | "ping";
}

// Ответ сервера — текстовое сообщение
export interface TextMessage {
  id: string;
  time: string;
  user_id: string;
  content: string;
  type: "message";
}

// Ответ сервера — файл
export interface FileMessage {
  id: string;
  time: string;
  user_id: string;
  content: string;
  type: "file";
  file: {
    id: number;
    user_id: number;
    path: string;
    filename: string;
    content_type: string;
    content_size: number;
    upload_date: string;
  };
}

// Ответ сервера — стикер
export interface StickerMessage {
  id: string;
  time: string;
  user_id: string;
  content: string;
  type: "sticker";
  file: {
    id: number;
    user_id: number;
    path: string;
    filename: string;
    content_type: string;
    content_size: number;
    upload_date: string;
  };
}

// Уведомление о подключении пользователя
export interface UserConnected {
  content: string; // userId
  type: "user connected";
}

// Ping/Pong для поддержания соединения
export interface PingMessage {
  type: "ping";
}

export interface PongMessage {
  type: "pong";
}

// System-сообщения — сервер возвращает старые сообщения в таком формате
export interface SystemMessage {
  type: "system";
  messages: ChatMessage[];
}

// Union всех типов сообщений от сервера
export type ServerMessage =
  | TextMessage
  | FileMessage
  | StickerMessage
  | UserConnected
  | PingMessage
  | PongMessage
  | SystemMessage
  | ChatMessage[];

// Общий интерфейс сообщения чата для UI-компонентов
export interface ChatMessage {
  id: string;
  time: string;
  user_id: string;
  content: string;
  type: "message" | "file" | "sticker";
  file?: {
    id: number;
    user_id: number;
    path: string;
    filename: string;
    content_type: string;
    content_size: number;
    upload_date: string;
  };
}
