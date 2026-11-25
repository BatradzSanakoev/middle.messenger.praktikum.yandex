import { describe, it, expect, beforeEach, afterEach } from "vitest";
import { HTTPTransport } from "./httpTransport";

class MockXHR {
  static instances: MockXHR[] = [];
  static reset() {
    MockXHR.instances = [];
  }

  method = "";
  url = "";
  withCredentials = false;
  timeout = 0;
  responseType: XMLHttpRequestResponseType = "";
  status = 200;
  statusText = "OK";
  responseText = "";
  response: unknown = null;
  sentBody: unknown = null;
  requestHeaders: Record<string, string> = {};
  responseHeaders: Record<string, string> = {};

  onload: (() => void) | null = null;
  onabort: (() => void) | null = null;
  onerror: (() => void) | null = null;
  ontimeout: (() => void) | null = null;

  constructor() {
    MockXHR.instances.push(this);
  }
  open(method: string, url: string) {
    this.method = method;
    this.url = url;
  }
  setRequestHeader(key: string, value: string) {
    this.requestHeaders[key] = value;
  }
  getResponseHeader(name: string) {
    return this.responseHeaders[name] ?? null;
  }
  send(body?: unknown) {
    this.sentBody = body;
  }
}

describe("HTTPTransport", () => {
  const originalXHR = global.XMLHttpRequest;

  beforeEach(() => {
    MockXHR.reset();
    global.XMLHttpRequest = MockXHR as unknown as typeof XMLHttpRequest;
  });
  afterEach(() => {
    global.XMLHttpRequest = originalXHR;
  });

  it("GET без data — URL с _t, без query до _t", () => {
    new HTTPTransport().get("/test");
    expect(MockXHR.instances[0].url).toMatch(/\/test\?_t=\d+$/);
  });

  it("GET с data — URL содержит ?a=1 перед _t (фикс этапа 1)", () => {
    new HTTPTransport().get("/test", { data: { a: 1 } });
    expect(MockXHR.instances[0].url).toMatch(/\/test\?a=1&_t=\d+$/);
  });

  it("POST с JSON ставит Content-Type и сериализует body", async () => {
    const p = new HTTPTransport().post("/test", { data: { a: 1 } });
    const xhr = MockXHR.instances[0];
    expect(xhr.method).toBe("POST");
    expect(xhr.requestHeaders["Content-Type"]).toBe("application/json");
    expect(xhr.sentBody).toBe('{"a":1}');
    xhr.status = 200;
    xhr.responseHeaders["Content-Type"] = "application/json";
    xhr.responseText = '{"id":1}';
    xhr.onload?.();
    await expect(p).resolves.toEqual({ id: 1 });
  });

  it("POST с FormData не ставит Content-Type вручную", () => {
    const fd = new FormData();
    fd.append("x", "1");
    new HTTPTransport().post("/test", { data: fd });
    expect(MockXHR.instances[0].requestHeaders["Content-Type"]).toBeUndefined();
  });

  it("4xx → reject с ApiError (status, response)", async () => {
    const p = new HTTPTransport().post("/test", { data: {} });
    const xhr = MockXHR.instances[0];
    xhr.status = 400;
    xhr.responseText = '{"reason":"Bad"}';
    xhr.responseHeaders["Content-Type"] = "application/json";
    xhr.onload?.();
    await expect(p).rejects.toMatchObject({ status: 400, response: { reason: "Bad" } });
  });

  it("timeout → reject с TimeoutError", async () => {
    const p = new HTTPTransport().get("/test");
    MockXHR.instances[0].ontimeout?.();
    await expect(p).rejects.toMatchObject({ reason: "Request timeout" });
  });
});
