import { METHODS, queryString, isPlainObject } from "./lib";
import type { RequestOptions, ApiError, AbortError, NetworkError, TimeoutError } from "./lib";

/**
 * Класс для отправки HTTP-запросов через XHR.
 * Поддерживает методы GET, POST, PUT, DELETE.
 * Использует дженерики для типизации ответов.
 */
export class HTTPTransport {
  /** GET-запрос с типизированным ответом */
  get = <T = unknown>(url: string, options: RequestOptions = {}): Promise<T> => {
    return this.request(url, { ...options, method: METHODS.GET });
  };

  /** POST-запрос с типизированным ответом */
  post = <T = unknown>(url: string, options: RequestOptions = {}): Promise<T> => {
    return this.request(url, { ...options, method: METHODS.POST });
  };

  /** PUT-запрос с типизированным ответом */
  put = <T = unknown>(url: string, options: RequestOptions = {}): Promise<T> => {
    return this.request(url, { ...options, method: METHODS.PUT });
  };

  /** DELETE-запрос с типизированным ответом */
  delete = <T = unknown>(url: string, options: RequestOptions = {}): Promise<T> => {
    return this.request(url, { ...options, method: METHODS.DELETE });
  };

  /**
   * Основной метод отправки запроса.
   * Создаёт XHR, настраивает заголовки, обрабатывает события.
   * Поддерживает FormData, JSON и пустые данные.
   */
  request = <T = unknown>(url: string, options: RequestOptions = {}): Promise<T> => {
    const { headers = {}, method, data, responseType, timeout = 5000 } = options;

    return new Promise<T>((resolve, reject) => {
      if (!method) {
        reject(new Error("HTTP method is required"));
        return;
      }

      const xhr = new XMLHttpRequest();
      // Cookies передаются автоматически (для авторизации)
      xhr.withCredentials = true;
      const isGet = method === METHODS.GET;

      // Для GET с data — добавляем query string в URL
      const finalUrl = isGet && isPlainObject(data) ? `${url}${queryString(data)}` : url;
      xhr.open(method, finalUrl);

      // Устанавливаем тип ответа, если указан
      if (responseType) {
        xhr.responseType = responseType;
      }

      // Устанавливаем кастомные заголовки
      Object.keys(headers).forEach((key) => {
        xhr.setRequestHeader(key, headers[key]);
      });

      // Обработка успешного/ошибочного ответа
      xhr.onload = function () {
        if (xhr.status >= 200 && xhr.status < 300) {
          let response: unknown;

          if (xhr.responseType) {
            response = xhr.response;
          } else {
            try {
              // Парсим JSON если сервер вернул application/json
              const contentType = xhr.getResponseHeader("Content-Type");
              if (contentType && contentType.includes("application/json")) {
                response = JSON.parse(xhr.responseText);
              } else {
                response = xhr.responseText;
              }
            } catch {
              response = xhr.responseText;
            }
          }

          resolve(response as T);
        } else {
          reject({
            status: xhr.status,
            statusText: xhr.statusText,
            response: xhr.responseText,
            request: xhr,
          } satisfies ApiError);
        }
      };

      // Обработка ошибок: прерывание, сеть, таймаут
      xhr.onabort = () => reject({ reason: "Request aborted", request: xhr } satisfies AbortError);
      xhr.onerror = () => reject({ reason: "Network error", request: xhr } satisfies NetworkError);

      xhr.timeout = timeout;
      xhr.ontimeout = () =>
        reject({ reason: "Request timeout", timeout, request: xhr } satisfies TimeoutError);

      // Отправка данных в зависимости от типа
      if (isGet || !data) {
        xhr.send();
      } else if (data instanceof FormData) {
        xhr.send(data);
      } else if (typeof data === "object") {
        if (!headers["Content-Type"]) {
          xhr.setRequestHeader("Content-Type", "application/json");
        }
        xhr.send(JSON.stringify(data));
      } else {
        xhr.send(String(data));
      }
    });
  };
}
