import { useEffect } from "react";
import { useSwarm } from "./useSwarm";
import { useProjects } from "./useProjects";
import { Project } from "../types/project-types";
import { Task } from "../types/task-types";

export function useSwarmEffect() {
  const { swarm, addMessage, setPeerCount, send, topic } = useSwarm();
  const { currentProject, tasks, addSharedProject } = useProjects();

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
      const {
        type,
        payload,
      }:
        | { type: "chat-message"; payload: string }
        | {
            type: "share-project";
            payload: { project: Project; tasks: Task[] };
          } = JSON.parse(data);

      switch (type) {
        case "chat-message":
          addMessage(payload, peer.pubKey.slice(0, 4));
          break;
        case "share-project":
          addSharedProject(payload.project, payload.tasks);
          break;
        default:
          console.error("unknown swarm message type");
      }
    });
  }, []);
}
