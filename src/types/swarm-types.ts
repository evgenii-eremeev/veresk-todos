export interface Swarm {
  join: (topic: string) => Promise<void>;
  sendAll: (message: string) => void;
  onConnectionsUpdate: (cb: (connections: Peer[]) => void) => void;
}

export interface Peer {}
