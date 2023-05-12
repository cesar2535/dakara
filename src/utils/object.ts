import { camelCase, snakeCase } from "lodash/fp";

interface Transformer {
  (key: string): string;
}

function transformKeys<T = any | any[]>(transformer: Transformer, obj: T): T {
  if (Array.isArray(obj)) {
    return obj.map((item) => transformKeys(transformer, item)) as T;
  }

  if (typeof obj === "object" && obj !== null) {
    return Object.entries(obj).reduce((acc, [key, value]) => {
      return {
        ...acc,
        [transformer(key)]: transformKeys(transformer, value),
      };
    }, {}) as T;
  }

  return obj;
}

export const camelizeKeys = transformKeys.bind(null, camelCase);
export const snakifyKeys = transformKeys.bind(null, snakeCase);
