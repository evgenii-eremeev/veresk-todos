
export interface Swarm {
  join: (topic: string) => Promise<void>;
  sendAll: (message: string) => void;
}