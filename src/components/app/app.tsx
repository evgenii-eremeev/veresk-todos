import React from "react";
import { Projects } from "../projects/Projects";
import { Persist } from "../../utils/persist";
import { Chat } from "../chat/Chat";
import { createTopic, Swarm } from "../../backend/swarm";

const persist = new Persist();

export function App() {
  return (
    <>
      <Projects persist={persist} />
      <Chat swarm={new Swarm} createTopic={createTopic}/>
    </>
  );
}
