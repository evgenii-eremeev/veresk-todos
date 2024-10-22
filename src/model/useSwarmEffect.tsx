import { useEffect } from "react";
import { useSwarm } from "./useSwarm";
import { Project } from "../types/project-types";
import { Task } from "../types/task-types";

interface Props {
  currentProject: Project | null;
  tasks: Task[];
}

export function useSwarmEffect({ currentProject, tasks }: Props) {
  const { swarm, addMessage, setPeerCount, send, topic } = useSwarm();

  useEffect(() => {
    swarm.onPeerConnected((peer) => {
      if (currentProject && topic && currentProject.topic == topic) {
        send(peer.pubKey, {
          type: "share-project",
          payload: { project: currentProject, tasks },
        });
      }
    });
  }, [currentProject, topic]);

  useEffect(() => {
    swarm.onConnectionsUpdate((connections) => {
      setPeerCount(connections.size);
    });

    swarm.onPeerData((peer, data) => {
      const parsedData = JSON.parse(data);
      if (parsedData.type === "chat-message") {
        addMessage(parsedData.payload, peer.pubKey.slice(0, 4));
      } else {
        console.log("message received", peer, data); // TODO display
      }
    });
  }, []);
}
