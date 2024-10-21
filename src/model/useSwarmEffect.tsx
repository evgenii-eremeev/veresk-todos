import { useEffect } from "react";
import { useSwarm } from "./useSwarm";
import { Peer } from "../types/swarm-types";

interface Props {
  onPeerConnected: (peer: Peer) => void;
  trackProps: Array<any>
}

export function useSwarmEffect({ onPeerConnected, trackProps }: Props) {
  const { swarm, addMessage, setPeerCount } = useSwarm();

  useEffect(() => {
    swarm.onPeerConnected(onPeerConnected);

    swarm.onConnectionsUpdate((connections) => {
      setPeerCount(connections.size);
    });

    swarm.onPeerData((peer, data) => {
      console.log("message received", peer, data)
      addMessage(data, peer.pubKey.slice(0, 4));
    });
  }, trackProps);
}
