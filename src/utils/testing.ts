import userEvent from "@testing-library/user-event";
import { screen } from "@testing-library/react";
import { Persist } from "./persist";
import { Peer, Swarm } from "../types/swarm-types";
import { Project } from "../types/project-types";
import { Task } from "../types/task-types";

export function hasClass(elem: HTMLElement, className: string) {
  return elem.classList.contains(className);
}

export async function addProjects(projectNames: Array<string>) {
  for (const projectName of projectNames) {
    await userEvent.click(screen.getByText("New project"));
    await userEvent.keyboard(`${projectName}{Enter}`);
  }
}

export async function addTasks(taskNames: Array<string>) {
  const draftInput = screen.getByRole("textbox");
  const addButton = screen.getByText("Add");

  for (const taskName of taskNames) {
    await userEvent.type(draftInput, taskName);
    await userEvent.click(addButton);
  }
}

export class PersistMock extends Persist {
  store: Record<string, string>;
  constructor(store: Record<string, string> = {}) {
    super();
    this.store = { ...store };
  }
  async set(key: string, value: string) {
    this.store[key] = value;
  }
  async get(key: string) {
    return this.store[key];
  }
}

export class SwarmMock implements Swarm {
  connections: Set<Peer> = new Set();
  eventCallbacks = {
    peerConnected: (peer: Peer) => {},
    connectionsUpdate: (connections: Set<Peer>) => {},
    peerData: (peer: Peer, data: string) => {},
  };

  join = jest.fn().mockResolvedValue(undefined);
  sendAll = jest.fn();
  send = jest.fn();

  onConnectionsUpdate(cb: (connections: Set<Peer>) => void) {
    this.eventCallbacks.connectionsUpdate = cb;
  }

  onPeerConnected(cb: (peer: Peer) => void) {
    this.eventCallbacks.peerConnected = cb;
  }

  onPeerData(cb: (peer: Peer, data: string) => void) {
    this.eventCallbacks.peerData = cb;
  }

  simulatePeerConnection(peer: Peer) {
    this.connections.add(peer);
    this.eventCallbacks.peerConnected(peer);
    this.eventCallbacks.connectionsUpdate(this.connections);
  }

  simulatePeerData(peer: Peer, data: string) {
    this.eventCallbacks.peerData(peer, data);
  }
}

export function getProjectMock(
  name: string,
  id: string,
  topic: null | string
): Project {
  return { name, id, topic };
}

export function getTaskMock(text: string, id: string, projectId: string): Task {
  return { text, id, projectId, completed: false };
}
