import { HTTPTransport } from "../api/httpTransport";

import type { ServerMessage, WSMessage } from "./types";

// HTTP-транспорт для получения токена
const transport = new HTTPTransport();

// WebSocketService — Singleton для работы с real-time сообщениями
// Подключается к WebSocket-серверу, управляет соединением, отправкой и получением сообщений
class WebSocketService {
  private static instance: WebSocketService; // Единственный экземпляр сервиса
  private socket: WebSocket | null = null; // Текущее WebSocket-соединение
  private pingInterval: ReturnType<typeof setInterval> | null = null; // Интервал авто-ping
  private userId: string | null = null; // ID текущего пользователя для reconnect
  private chatId: string | null = null; // ID текущего чата для reconnect

  // Получение единственного экземпляра сервиса
  static getInstance(): WebSocketService {
    if (!WebSocketService.instance) {
      WebSocketService.instance = new WebSocketService();
    }
    return WebSocketService.instance;
  }

  // Подключение к WebSocket-серверу чата
  // Получает токен через HTTP и устанавливает соединение
  async connect(userId: string, chatId: string): Promise<void> {
    // Если уже подключены к этому чату — ничего не делаем
    if (
      this.socket &&
      this.userId === userId &&
      this.chatId === chatId &&
      this.socket.readyState === WebSocket.OPEN
    ) {
      return;
    }

    // Если есть старое соединение — закрываем
    this.disconnect();

    this.userId = userId;
    this.chatId = chatId;

    // Получаем токен для подключения к чату
    const response = await transport.post(`/api/v2/chats/token/${chatId}`, {});
    const data = response as { token: string };
    const token = data.token;

    // Формируем URL для подключения
    const wsUrl = `wss://ya-praktikum.tech/ws/chats/${userId}/${chatId}/${token}`;

    this.socket = new WebSocket(wsUrl);

    // Обработчик открытия соединения
    this.socket.addEventListener("open", () => {
      this.startPing();
      // Запрашиваем старые сообщения при подключении к чату
      this.sendOldMessages(0);
    });

    // Обработчик входящих сообщений
    this.socket.addEventListener("message", (event: MessageEvent) => {
      this.handleMessage(event.data);
    });

    // Обработчик ошибок
    this.socket.addEventListener("error", (event) => {
      // eslint-disable-next-line no-console
      console.error("WebSocket error:", event);
    });

    // Обработчик закрытия соединения
    this.socket.addEventListener("close", (event) => {
      // eslint-disable-next-line no-console
      console.log(`WebSocket closed: code=${event.code}, reason=${event.reason}`);
      this.stopPing();
      // Reconnect при нечистом закрытии (код != 1000)
      if (event.code !== 1000 && this.userId && this.chatId) {
        // eslint-disable-next-line no-console
        console.log("Attempting to reconnect...");
        this.reconnect();
      }
    });
  }

  // Отправка сообщения на сервер
  send(data: WSMessage): void {
    if (this.socket && this.socket.readyState === WebSocket.OPEN) {
      this.socket.send(JSON.stringify(data));
    }
  }

  // Запрос старых сообщений с пагинацией
  // offset — ID сообщения, с которого начинать загрузку (0 = с самого начала)
  sendOldMessages(offset: number): void {
    this.send({ content: String(offset), type: "get old" });
  }

  // Закрытие соединения и очистка
  disconnect(): void {
    this.stopPing();

    if (this.socket) {
      this.socket.close();
    }

    this.socket = null;
    this.userId = null;
    this.chatId = null;
  }

  // Переподключение при обрыве соединения
  private reconnect(): void {
    // Небольшая задержка перед переподключением
    setTimeout(() => {
      if (this.userId && this.chatId) {
        // eslint-disable-next-line no-console
        console.log(`Reconnecting to chat ${this.chatId}...`);
        this.connect(this.userId, this.chatId);
      }
    }, 3000); // 3 секунды задержка
  }

  // Отправка ping для поддержания соединения
  private startPing(): void {
    this.pingInterval = setInterval(() => {
      if (this.socket && this.socket.readyState === WebSocket.OPEN) {
        this.send({ type: "ping" });
      }
    }, 30000); // каждые 30 секунд
  }

  // Остановка ping-интервала
  private stopPing(): void {
    if (this.pingInterval) {
      clearInterval(this.pingInterval);
      this.pingInterval = null;
    }
  }

  // Обработка входящего сообщения от сервера
  // Парсит JSON и dispatch'ит обработчикам
  private handleMessage(data: string): void {
    try {
      const parsed = JSON.parse(data) as ServerMessage;

      // eslint-disable-next-line no-console
      console.log("WebSocket message:", parsed);
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error("Error parsing WebSocket message:", error, "Data:", data);
    }
  }
}

export default WebSocketService;
