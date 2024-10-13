export interface Persist {
  set: (key: string, value: string) => void;
  get: (key: string) => string;
}
