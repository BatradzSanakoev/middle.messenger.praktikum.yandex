import { describe, it, expect } from "vitest";
import { merge } from "./merge";

describe("merge", () => {
  it("должна объединять два плоских объекта", () => {
    const result = merge({ a: 1 }, { b: 2 });
    expect(result).toEqual({ a: 1, b: 2 });
  });

  it("должна создавать новый объект, не мутируя исходные", () => {
    const lhs = { a: 1 };
    const rhs = { b: 2 };
    const result = merge(lhs, rhs);
    expect(result).toEqual({ a: 1, b: 2 });
    expect(lhs).toEqual({ a: 1 });
    expect(rhs).toEqual({ b: 2 });
  });

  it("должна перезаписывать значения с одинаковыми ключами", () => {
    const result = merge({ a: 1, b: 2 }, { b: 3, c: 4 });
    expect(result).toEqual({ a: 1, b: 3, c: 4 });
  });

  it("должна рекурсивно объединять вложенные объекты", () => {
    const result = merge({ a: { b: 1, c: 2 } }, { a: { c: 3, d: 4 } });
    expect(result).toEqual({ a: { b: 1, c: 3, d: 4 } });
  });

  it("должна заменять массивы, а не объединять их", () => {
    const result = merge({ a: [1, 2] }, { a: [3, 4] });
    expect(result).toEqual({ a: [3, 4] });
  });

  it("должна заменять объекты на массивы и наоборот", () => {
    const result = merge({ a: { b: 1 } }, { a: [1, 2] });
    expect(result).toEqual({ a: [1, 2] });
  });

  it("должна обрабатывать null и undefined", () => {
    const result = merge({ a: 1 }, { a: null });
    expect(result).toEqual({ a: null });
  });

  it("должна обрабатывать пустые объекты", () => {
    expect(merge({}, { a: 1 })).toEqual({ a: 1 });
    expect(merge({ a: 1 }, {})).toEqual({ a: 1 });
    expect(merge({}, {})).toEqual({});
  });

  it("вложенный пустой объект заменяет lhs, а не сливается с ним", () => {
    expect(merge({ messages: { a: 1, b: 2 } }, { messages: {} })).toEqual({ messages: {} });
  });

  it("вложенный пустой объект не стирает соседей", () => {
    expect(merge({ messages: { a: 1 }, user: { id: 1 } }, { messages: {} })).toEqual({
      messages: {},
      user: { id: 1 },
    });
  });

  it("top-level пустой rhs — no-op", () => {
    // Это ожидаемое поведение, не баг
    expect(merge({ a: 1 }, {})).toEqual({ a: 1 });
  });

  it("должна обрабатывать глубокие вложенности", () => {
    const result = merge({ a: { b: { c: 1, d: 2 } } }, { a: { b: { d: 3, e: 4 } } });
    expect(result).toEqual({ a: { b: { c: 1, d: 3, e: 4 } } });
  });
});
