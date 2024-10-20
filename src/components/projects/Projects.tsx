import React, { useState } from "react";
import { Tasks } from "../tasks/Tasks";
import { ProjectsModelProvider } from "../../model/ProjectsModel";
import { ProjectCreator } from "./ProjectCreator";
import { ProjectTabs } from "./ProjectTabs";
import { Persist } from "../../types/persist-types";
import {
  CreateTopic,
  SwarmModelProvider,
  useSwarm,
} from "../../model/SwarmModel";
import { Swarm } from "../../types/swarm-types";
import { Button } from "../common/Button";

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
            <ProjectJoiner />
          </div>
          <div className="col-span-9">
            <Tasks />
          </div>
        </div>
      </SwarmModelProvider>
    </ProjectsModelProvider>
  );
}

function ProjectJoiner() {
  const { joinTopic } = useSwarm();
  return (
    <ModalLike
      mainLabel="Join project"
      secondaryLabel="Join topic"
      inputLabel="Topic"
      onSubmit={joinTopic}
    />
  );
}

interface ModalLikeProps {
  mainLabel: string;
  secondaryLabel: string;
  inputLabel: string;
  onSubmit: (topic: string) => void;
}

function ModalLike({ mainLabel, secondaryLabel, inputLabel, onSubmit }: ModalLikeProps) {
  const [showInput, setShowInput] = useState(false);
  const [draft, setDraft] = useState("");
  return (
    <>
      {!showInput && (
        <Button onClick={() => setShowInput(true)}>{mainLabel}</Button>
      )}
      {showInput && (
        <form
          onSubmit={(event) => {
            event.preventDefault();
            onSubmit(draft);
            setShowInput(false);
            setDraft("")
          }}
        >
          <label className="hidden" htmlFor={`${mainLabel}-input`}>
            {inputLabel}
          </label>
          <input
            autoFocus
            id={`${mainLabel}-input`}
            onChange={(event) => {
              setDraft(event.target.value);
            }}
          />
          <Button type="submit">{secondaryLabel}</Button>
        </form>
      )}
    </>
  );
}
