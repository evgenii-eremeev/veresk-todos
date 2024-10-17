import React from "react";
import { Tasks } from "../tasks/Tasks";
import { ProjectsModelProvider } from "../../model/ProjectsModel";
import { ProjectCreator } from "./ProjectCreator";
import { ProjectTabs } from "./ProjectTabs";
import { Persist } from "../../types/persist-types";
import { Chat } from "../chat/Chat";
import { CreateTopic, SwarmModelProvider } from "../../model/SwarmModel";
import { Swarm } from "../../types/swarm-types";

interface Props {
  persist: Persist;
  swarm: Swarm;
  createTopic: CreateTopic;
}

export function Projects({ persist, swarm, createTopic }: Props) {
  return (
    <ProjectsModelProvider persist={persist}>
      <SwarmModelProvider swarm={swarm} createTopic={createTopic}>
        <div className="grid grid-cols-12">
          <div className="col-span-3">
            <ProjectCreator />
            <ProjectTabs />
          </div>
          <div className="col-span-9">
            <Tasks />
            <Chat />
          </div>
        </div>
      </SwarmModelProvider>
    </ProjectsModelProvider>
  );
}
