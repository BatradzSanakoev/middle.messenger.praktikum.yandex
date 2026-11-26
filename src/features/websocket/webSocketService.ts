import { HTTPTransport } from "../api/httpTransport";

import type { ServerMessage, WSMessage } from "./types";

// Callback для обработчиков сообщений — передаёт сообщение и chatId источника
type MessageCallback = (data: ServerMessage, chatId: string) => void;

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
  private generation = 0; // Generation-токен для отсеивания старых подключений

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

    // Закрываем текущий сокет, generation инкрементируется ниже
    this.closeCurrentSocket();

    const gen = ++this.generation; // ← отсекает все старые подключения
    this.userId = userId;
    this.chatId = chatId;
    this.isConnecting = true;

    // Сохраняем Promise подключения для ожидания в send()
    // Promise завершается только когда сокет открыт
    this.connectPromise = new Promise<void>((resolve, reject) => {
      const connect = async () => {
        try {
          // Получаем токен для подключения к чату
          const response = await transport.post(`/chats/token/${chatId}`, {});
          // Устарели, пока ждали токен
          if (gen !== this.generation) return;

          const token = (response as { token: string }).token;
          const wsUrl = `wss://ya-praktikum.tech/ws/chats/${userId}/${chatId}/${token}`;
          // Локальная переменная — обработчики не захватят новый сокет
          const socket = new WebSocket(wsUrl);
          this.socket = socket;

          socket.addEventListener("open", () => {
            if (gen !== this.generation) {
              socket.close(1000);
              return;
            }
            this.startPing();
            this.isConnecting = false;
            this.reconnectAttempts = 0;
            this.connectPromise = null;
            resolve();
          });

          socket.addEventListener("message", (event: MessageEvent) => {
            if (gen !== this.generation) return;
            this.handleMessage(event.data);
          });

          socket.addEventListener("error", (event) => {
            if (gen !== this.generation) return;
            this.isConnecting = false;
            this.connectPromise = null;
            reject(event);
          });

          socket.addEventListener("close", (event) => {
            if (gen !== this.generation) return; // ← старый сокет — молчим
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
          if (gen !== this.generation) return;
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
  send(data: WSMessage): boolean {
    // Если подключение ещё идёт — ставим в очередь, считаем успехом
    if (this.isConnecting && this.connectPromise) {
      this.connectPromise
        .then(() => this.doSend(data))
        .catch((err) => {
          // eslint-disable-next-line no-console
          console.error("Ошибка при отправке сообщения:", err);
        });
      return true;
    }
    return this.doSend(data);
  }

  // Внутренний метод отправки — возвращает true если отправлено, false иначе
  private doSend(data: WSMessage): boolean {
    if (this.socket?.readyState !== WebSocket.OPEN) return false;
    try {
      this.socket.send(JSON.stringify(data));
      return true;
    } catch {
      return false;
    }
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
    this.closeCurrentSocket();
    this.generation++; // ← инвалидируем все висящие подключения
    this.userId = null;
    this.chatId = null;
  }

  // Переподключение при обрыве соединения
  private reconnect(): void {
    const delay = Math.min(3000 * Math.pow(1.5, this.reconnectAttempts), 30000);
    setTimeout(async () => {
      if (!this.userId || !this.chatId) return;
      try {
        await this.connect(this.userId, this.chatId);
        this.sendOldMessages(); // ← догружаем пропущенное (дедуп в chat.ts)
      } catch {
        // connect сам решит, повторять ли (reconnectAttempts)
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

  // Общий cleanup сокета
  private closeCurrentSocket(): void {
    this.stopPing();
    if (this.socket) {
      try {
        this.socket.close(1000, "Client disconnect");
      } catch {
        /* уже закрыт */
      }
    }
    this.socket = null;
    this.isConnecting = false;
    this.connectPromise = null;
    this.reconnectAttempts = 0;
  }

  // Обработка входящего сообщения от сервера
  // Парсит JSON и dispatch'ит обработчикам с chatId источника
  private handleMessage(data: string): void {
    try {
      const parsed = JSON.parse(data) as ServerMessage;
      // Вызываем зарегистрированный обработчик с chatId источника
      if (this.messageCallback && this.chatId) {
        this.messageCallback(parsed, this.chatId);
      }
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error("Error parsing WebSocket message:", error, "Data:", data);
    }
  }
}

export default WebSocketService;
