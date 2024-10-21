import { useEffect } from "react";
import { useSwarm } from "./useSwarm";
import { Peer } from "../types/swarm-types";

interface Props {
  onPeerConnected: (peer: Peer) => void;
}

export function useSwarmEffect({onPeerConnected}: Props) {
  const { swarm, addMessage, setPeerCount } = useSwarm();


  useEffect(() => {
    swarm.onPeerConnected(onPeerConnected);

    swarm.onConnectionsUpdate((connections) => {
      setPeerCount(connections.size);
    });
  
    swarm.onPeerData((peer, data) => {
      addMessage(data, peer.pubKey.slice(0, 4));
    });
  }, []);
}