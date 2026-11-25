import { HTTPTransport } from "../api/httpTransport";

import type { ServerMessage, WSMessage } from "./types";

// Callback для обработчиков сообщений
type MessageCallback = (data: ServerMessage) => void;

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
  private messageCallback: MessageCallback | null = null; // Обработчик входящих сообщений
  private isConnecting: boolean = false; // Флаг процесса подключения
  private connectPromise: Promise<void> | null = null; // Promise подключения для ожидания
  private reconnectAttempts = 0; // Счётчик попыток reconnect
  private maxReconnectAttempts = 5; // Максимальное количество попыток reconnect

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

    // Сохраняем обработчик сообщений перед disconnect — иначе он потеряется
    const savedCallback = this.messageCallback;

    // Если есть старое соединение — закрываем
    this.disconnect();

    this.userId = userId;
    this.chatId = chatId;
    this.isConnecting = true;

    // Восстанавливаем обработчик сообщений — он был сброшен disconnect()
    this.messageCallback = savedCallback;

    // Сохраняем Promise подключения для ожидания в send()
    // Promise завершается только когда сокет открыт
    this.connectPromise = new Promise<void>((resolve, reject) => {
      const connect = async () => {
        try {
          // Получаем токен для подключения к чату
          const response = await transport.post(`/chats/token/${chatId}`, {});
          const data = response as { token: string };
          const token = data.token;

          // Формируем URL для подключения
          const wsUrl = `wss://ya-praktikum.tech/ws/chats/${userId}/${chatId}/${token}`;

          this.socket = new WebSocket(wsUrl);

          // Обработчик открытия соединения — resolve'им Promise
          this.socket.addEventListener("open", () => {
            this.startPing();
            this.isConnecting = false;
            this.reconnectAttempts = 0; // Сбрасываем счётчик при успешном подключении
            this.connectPromise = null;
            resolve();
          });

          // Обработчик входящих сообщений
          this.socket.addEventListener("message", (event: MessageEvent) => {
            this.handleMessage(event.data);
          });

          // Обработчик ошибок
          this.socket.addEventListener("error", (event) => {
            this.isConnecting = false;
            this.connectPromise = null;
            reject(event);
          });

          // Обработчик закрытия соединения
          this.socket.addEventListener("close", (event) => {
            this.stopPing();
            // Reconnect при нечистом закрытии (код != 1000) с лимитом попыток
            if (
              event.code !== 1000 &&
              this.userId &&
              this.chatId &&
              this.reconnectAttempts < this.maxReconnectAttempts
            ) {
              this.reconnectAttempts++;
              this.reconnect();
            }
          });
        } catch (error) {
          this.isConnecting = false;
          this.connectPromise = null;
          reject(error);
        }
      };
      connect();
    });

    return this.connectPromise;
  }

  // Отправка сообщения на сервер
  // Если подключение ещё идёт — ждёт его завершения перед отправкой
  send(data: WSMessage): void {
    // Если подключение ещё идёт — ждём его завершения
    if (this.isConnecting && this.connectPromise) {
      this.connectPromise
        .then(() => {
          if (this.socket && this.socket.readyState === WebSocket.OPEN) {
            this.socket.send(JSON.stringify(data));
            // eslint-disable-next-line no-console
            console.log("Сообщение отправлено через WebSocket:", data);
          } else {
            // eslint-disable-next-line no-console
            console.warn("WebSocket не подключён, readyState:", this.socket?.readyState);
          }
        })
        .catch((err) => {
          // eslint-disable-next-line no-console
          console.error("Ошибка при отправке сообщения:", err);
        });
      return;
    }
    // Если сокет не инициализирован — ничего не делаем
    if (!this.socket) {
      // eslint-disable-next-line no-console
      console.warn("WebSocket не инициализирован");
      return;
    }
    // Если сокет не подключён — ничего не делаем
    if (this.socket.readyState !== WebSocket.OPEN) {
      // eslint-disable-next-line no-console
      console.warn("WebSocket не подключён, readyState:", this.socket.readyState);
      return;
    }
    this.socket.send(JSON.stringify(data));
    // eslint-disable-next-line no-console
    console.log("Сообщение отправлено через WebSocket:", data);
  }

  // Запрос старых сообщений
  sendOldMessages(): void {
    this.send({ content: "0", type: "get old" });
  }

  // Регистрация обработчика входящих сообщений
  onMessage(callback: MessageCallback): void {
    this.messageCallback = callback;
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
    // НЕ сбрасываем messageCallback — он нужен для нового подключения
    // this.messageCallback = null;
  }

  // Переподключение при обрыве соединения
  private reconnect(): void {
    // Задержка увеличивается с каждой попыткой (экспоненциальная)
    const delay = Math.min(3000 * Math.pow(1.5, this.reconnectAttempts), 30000);
    setTimeout(() => {
      if (this.userId && this.chatId) {
        this.connect(this.userId, this.chatId);
      }
    }, delay);
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

      // Вызываем зарегистрированный обработчик
      if (this.messageCallback) {
        this.messageCallback(parsed);
      }
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error("Error parsing WebSocket message:", error, "Data:", data);
    }
  }
}

export default WebSocketService;
