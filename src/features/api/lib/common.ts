export type PlainObject<T = unknown> = {
  [key: string]: T;
};

export function isPlainObject(value: unknown): value is PlainObject {
  return typeof value === 'object'
    && value !== null
    && value.constructor === Object
    && Object.prototype.toString.call(value) === '[object Object]';
}

export function isArray(value: unknown): value is unknown[] {
  return Array.isArray(value);
}

export function isArrayOrObject(value: unknown): value is unknown[] | PlainObject {
  return isPlainObject(value) || isArray(value);
}

function getKey(key: string, parentKey?: string): string {
  return parentKey ? `${parentKey}[${key}]` : key;
}

function getParams(data: PlainObject | unknown[], parentKey?: string): [string, string][] {
  const result: [string, string][] = [];

  for (const [key, value] of Object.entries(data)) {
    if (value === undefined || value === null) {
      continue;
    }

    if (isArrayOrObject(value)) {
      result.push(...getParams(value, getKey(key, parentKey)));
    } else {
      result.push([getKey(key, parentKey), encodeURIComponent(String(value))]);
    }
  }

  return result;
}

export function queryString(data: PlainObject): string {
  if (!isPlainObject(data)) {
    throw new Error('input must be an object');
  }

  return getParams(data).map(([key, value]) => `${key}=${value}`).join('&');
}
