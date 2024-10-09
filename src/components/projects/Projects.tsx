import React from "react";
import { Tasks } from "../tasks/Tasks";
import { useProjects } from "../../model/ProjectsModel";
import { ProjectCreator } from "./ProjectCreator";
import { ProjectTabs } from "./ProjectTabs";

export function Projects() {
  const { selectedProject } =
    useProjects();

  return (
    <>
      <ProjectCreator />
      <ProjectTabs />
      {selectedProject && <Tasks />}
    </>
  );
}
