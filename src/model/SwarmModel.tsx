import React, {
  createContext,
  PropsWithChildren,
  useContext,
  useEffect,
  useState,
} from "react";
import { Swarm as SwarmI } from "../types/swarm-types";
import { Message } from "../types/communication-types";

const SwarmModelContext = createContext<SwarmModel | null>(null);

export function useSwarm() {
  const model = useContext(SwarmModelContext);
  if (!model) {
    throw new Error("useProjects must be used within a SwarmModelProvider");
  } else return model;
}

export function SwarmModelProvider({
  children,
  swarm,
  createTopic,
}: PropsWithChildren<{ swarm: SwarmI; createTopic: CreateTopic }>) {
  const model = useSwarmModel({ swarm, createTopic });
  return <SwarmModelContext.Provider value={model} children={children} />;
}

export type CreateTopic = () => string;
export interface SwarmModel {
  createTopic: CreateTopic;
  topic: string | null;
  peerCount: number;
  messages: Array<Message>;
  joinTopic: (topic: string) => Promise<void>;
  isJoining: boolean;
  sendAll: (text: string) => void;
}

function useSwarmModel({
  swarm,
  createTopic,
}: {
  swarm: SwarmI;
  createTopic: CreateTopic;
}): SwarmModel {
  const [topic, setTopic] = useState<string | null>(null);
  const [peerCount, setPeerCount] = useState(0);
  const [messages, setMessages] = useState<Array<Message>>([]);
  const [isJoining, setIsJoining] = useState(false);

  useEffect(() => {
    swarm.onConnectionsUpdate((connections) => {
      setPeerCount(connections.size);
    });

    swarm.onPeerData((peer, data) => {
      addMessage(data, peer.pubKey.slice(0, 4));
    });
  }, []);

  function addMessage(text: string, from: string) {
    setMessages((messages) => [...messages, { text, from }]);
  }

  async function joinTopic(topic: string) {
    setIsJoining(true);
    await swarm.join(topic);
    setIsJoining(false);
    setTopic(topic);
  }

  function sendAll(text: string) {
    addMessage(text, "me");
    swarm.sendAll(text);
  }

  return {
    topic,
    createTopic,
    peerCount,
    messages,
    joinTopic,
    isJoining,
    sendAll
  };
}
