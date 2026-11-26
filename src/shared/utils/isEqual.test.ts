import { describe, it, expect } from "vitest";
import { isEqual } from "./isEqual";

describe("isEqual", () => {
  it("должна возвращать true для одинаковых примитивов", () => {
    expect(isEqual(1, 1)).toBe(true);
    expect(isEqual("hello", "hello")).toBe(true);
    expect(isEqual(true, true)).toBe(true);
    expect(isEqual(null, null)).toBe(true);
    expect(isEqual(undefined, undefined)).toBe(true);
  });

  it("должна возвращать false для разных примитивов", () => {
    expect(isEqual(1, 2)).toBe(false);
    expect(isEqual("hello", "world")).toBe(false);
    expect(isEqual(true, false)).toBe(false);
  });

  it("должна возвращать false для разных типов", () => {
    expect(isEqual(1, "1")).toBe(false);
    expect(isEqual(null, undefined)).toBe(false);
    expect(isEqual(true, 1)).toBe(false);
  });

  it("должна возвращать true для одинаковых объектов", () => {
    expect(isEqual({ a: 1 }, { a: 1 })).toBe(true);
    expect(isEqual({ a: 1, b: 2 }, { a: 1, b: 2 })).toBe(true);
  });

  it("должна возвращать false для разных объектов", () => {
    expect(isEqual({ a: 1 }, { a: 2 })).toBe(false);
    expect(isEqual({ a: 1 }, { b: 1 })).toBe(false);
    expect(isEqual({ a: 1 }, { a: 1, b: 2 })).toBe(false);
  });

  it("должна рекурсивно сравнивать вложенные объекты", () => {
    expect(isEqual({ a: { b: 1 } }, { a: { b: 1 } })).toBe(true);
    expect(isEqual({ a: { b: 1 } }, { a: { b: 2 } })).toBe(false);
    expect(isEqual({ a: { b: { c: 1 } } }, { a: { b: { c: 1 } } })).toBe(true);
  });

  it("должна сравнивать массивы", () => {
    expect(isEqual([1, 2, 3], [1, 2, 3])).toBe(true);
    expect(isEqual([1, 2, 3], [1, 2, 4])).toBe(false);
    expect(isEqual([1, 2], [1, 2, 3])).toBe(false);
  });

  it("должна сравнивать массивы объектов", () => {
    expect(isEqual([{ a: 1 }, { b: 2 }], [{ a: 1 }, { b: 2 }])).toBe(true);
    expect(isEqual([{ a: 1 }], [{ a: 2 }])).toBe(false);
  });

  it("должна возвращать false для объекта и массива", () => {
    expect(isEqual({ a: 1 }, [1])).toBe(false);
  });

  it("должна возвращать true для одного и того же объекта", () => {
    const obj = { a: 1 };
    expect(isEqual(obj, obj)).toBe(true);
  });
});
