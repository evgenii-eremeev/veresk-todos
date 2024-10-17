export interface Swarm {
  join: (topic: string) => Promise<void>;
  sendAll: (message: string) => void;
  onConnectionsUpdate: (cb: (connections: Set<Peer>) => void) => void;
  onPeerData: (cb: (peer: Peer, data: string) => void) => void;
}

export interface PeerHyperswarm {
  remotePublicKey: Buffer;
  write: (data: Buffer) => void;
}

export interface Peer {
  pubKey: string;
}
