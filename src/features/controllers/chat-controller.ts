import { ChatAPI } from "../api";
import { store } from "@shared/utils";
import type { ChatResponse, ChatUser, UnreadCountResponse } from "../api";

const chatAPI = new ChatAPI();

/**
 * Контроллер чатов — управление списком чатов, пользователями в чатах.
 */
export class ChatController {
  /**
   * Получение списка чатов.
   * - Запрашивает чаты у API
   * - Сохраняет в Store
   */
  static async getChats(): Promise<ChatResponse[]> {
    const chats = await chatAPI.get();
    store.setState("chats", chats);
    return chats;
  }

  /**
   * Создание нового чата.
   * - Отправляет данные на сервер
   * - Обновляет список чатов в Store
   */
  static async createChat(data: { title: string }): Promise<ChatResponse> {
    const chat = await chatAPI.create(data);
    const chats = store.getState().chats as ChatResponse[] || [];
    store.setState("chats", [...chats, chat]);
    return chat;
  }

  /**
   * Удаление чата.
   * - Удаляет чат с сервера
   * - Обновляет список чатов в Store
   */
  static async deleteChat(chatId: number): Promise<void> {
    await chatAPI.delete({ id: chatId });
    const chats = store.getState().chats as ChatResponse[] || [];
    store.setState(
      "chats",
      chats.filter((c) => c.id !== chatId),
    );
  }

  /**
   * Получение пользователей чата.
   * - Запрашивает пользователей по ID чата
   * - Возвращает массив пользователей
   */
  static async getChatUsers(chatId: number): Promise<ChatUser[]> {
    return chatAPI.getUsers(chatId);
  }

  /**
   * Получение количества непрочитанных сообщений.
   * - Запрашивает счётчик для чата
   * - Возвращает объект с чатами и счётчиками
   */
  static async getUnreadCount(chatId: number): Promise<UnreadCountResponse> {
    return chatAPI.getUnreadCount(chatId);
  }

  /**
   * Добавление пользователя в чат.
   * - Отправляет userId и chatId на сервер
   */
  static async addUserToChat(userId: number, chatId: number): Promise<void> {
    await chatAPI.addUser({ chatId, users: [userId] });
  }

  /**
   * Удаление пользователя из чата.
   * - Отправляет userId и chatId на сервер
   */
  static async removeUserFromChat(userId: number, chatId: number): Promise<void> {
    await chatAPI.removeUser({ chatId, users: [userId] });
  }
}
