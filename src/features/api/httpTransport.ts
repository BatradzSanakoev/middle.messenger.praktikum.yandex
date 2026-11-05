import { METHODS, queryString, isPlainObject } from "./lib";
import type { RequestOptions, ApiError, AbortError, NetworkError, TimeoutError } from "./lib";

export class HTTPTransport {
  get = <T = unknown>(url: string, options: RequestOptions = {}): Promise<T> => {
    return this.request(url, { ...options, method: METHODS.GET });
  };

  post = <T = unknown>(url: string, options: RequestOptions = {}): Promise<T> => {
    return this.request(url, { ...options, method: METHODS.POST });
  };

  put = <T = unknown>(url: string, options: RequestOptions = {}): Promise<T> => {
    return this.request(url, { ...options, method: METHODS.PUT });
  };

  delete = <T = unknown>(url: string, options: RequestOptions = {}): Promise<T> => {
    return this.request(url, { ...options, method: METHODS.DELETE });
  };

  request = <T = unknown>(url: string, options: RequestOptions = {}): Promise<T> => {
    const { headers = {}, method, data, responseType, timeout = 5000 } = options;

    return new Promise<T>((resolve, reject) => {
      if (!method) {
        reject(new Error("HTTP method is required"));
        return;
      }

      const xhr = new XMLHttpRequest();
      xhr.withCredentials = true;
      const isGet = method === METHODS.GET;

      const finalUrl = isGet && isPlainObject(data) ? `${url}${queryString(data)}` : url;
      xhr.open(method, finalUrl);

      if (responseType) {
        xhr.responseType = responseType;
      }

      Object.keys(headers).forEach((key) => {
        xhr.setRequestHeader(key, headers[key]);
      });

      xhr.onload = function () {
        if (xhr.status >= 200 && xhr.status < 300) {
          let response: unknown;

          if (xhr.responseType) {
            response = xhr.response;
          } else {
            try {
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

      xhr.onabort = () => reject({ reason: "Request aborted", request: xhr } satisfies AbortError);
      xhr.onerror = () => reject({ reason: "Network error", request: xhr } satisfies NetworkError);

      xhr.timeout = timeout;
      xhr.ontimeout = () =>
        reject({ reason: "Request timeout", timeout, request: xhr } satisfies TimeoutError);

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
