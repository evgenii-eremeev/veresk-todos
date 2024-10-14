export interface Persist {
  set: (key: string, value: string) => Promise<void>;
  get: (key: string) => Promise<string>;
  getParsed: <T>(key: string, fallback: T) => Promise<T>;
}
