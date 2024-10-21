export interface Swarm {
  join: (topic: string) => Promise<void>;
  sendAll: (message: string) => void;
  send: (to: string, message: string) => void;
  onConnectionsUpdate: (cb: (connections: Set<Peer>) => void) => void;
  onPeerData: (cb: (peer: Peer, data: string) => void) => void;
  onPeerConnected: (cb: (peer: Peer) => void) => void;
}

export interface PeerHyperswarm {
  remotePublicKey: Buffer;
  write: (data: Buffer) => void;
}

export interface Peer {
  pubKey: string;
}
