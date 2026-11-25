import { describe, it, expect } from "vitest";
import { queryString, isPlainObject, isArray, isArrayOrObject } from "./common";

describe("isPlainObject", () => {
  it("должен возвращать true для обычного объекта", () => {
    expect(isPlainObject({ a: 1 })).toBe(true);
    expect(isPlainObject({})).toBe(true);
    expect(isPlainObject({ a: 1, b: 2 })).toBe(true);
  });

  it("должен возвращать false для null", () => {
    expect(isPlainObject(null)).toBe(false);
  });

  it("должен возвращать false для массива", () => {
    expect(isPlainObject([1, 2, 3])).toBe(false);
  });

  it("должен возвращать false для примитивов", () => {
    expect(isPlainObject("string")).toBe(false);
    expect(isPlainObject(123)).toBe(false);
    expect(isPlainObject(true)).toBe(false);
    expect(isPlainObject(undefined)).toBe(false);
  });

  it("должен возвращать false для класса", () => {
    class Foo {}
    expect(isPlainObject(new Foo())).toBe(false);
  });
});

describe("isArray", () => {
  it("должен возвращать true для массива", () => {
    expect(isArray([1, 2, 3])).toBe(true);
    expect(isArray([])).toBe(true);
  });

  it("должен возвращать false для объекта", () => {
    expect(isArray({ a: 1 })).toBe(false);
  });
});

describe("isArrayOrObject", () => {
  it("должен возвращать true для объекта", () => {
    expect(isArrayOrObject({ a: 1 })).toBe(true);
  });

  it("должен возвращать true для массива", () => {
    expect(isArrayOrObject([1, 2])).toBe(true);
  });

  it("должен возвращать false для примитивов", () => {
    expect(isArrayOrObject("string")).toBe(false);
    expect(isArrayOrObject(123)).toBe(false);
  });
});

describe("queryString", () => {
  it("должен формировать query string из объекта", () => {
    expect(queryString({ a: 1, b: 2 })).toBe("a=1&b=2");
  });

  it("должен кодировать специальные символы", () => {
    expect(queryString({ name: "test value" })).toBe("name=test%20value");
  });

  it("должен игнорировать null и undefined", () => {
    const result = queryString({ a: 1, b: null, c: undefined });
    expect(result).toBe("a=1");
  });

  it("должен бросать ошибку для не-объекта", () => {
    expect(() => queryString("string" as unknown as Record<string, unknown>)).toThrow(
      "input must be an object"
    );
  });

  it("должен обрабатывать вложенные объекты", () => {
    expect(queryString({ a: { b: 1 } })).toBe("a[b]=1");
  });

  it("должен обрабатывать вложенные массивы", () => {
    expect(queryString({ items: [1, 2] })).toBe("items[0]=1&items[1]=2");
  });

  it("должен возвращать пустую строку для пустого объекта", () => {
    expect(queryString({})).toBe("");
  });
});
