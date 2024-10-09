import React from "react";
import { Tasks } from "../tasks/Tasks";
import { ProjectsModelProvider } from "../../model/ProjectsModel";
import { ProjectCreator } from "./ProjectCreator";
import { ProjectTabs } from "./ProjectTabs";

export function Projects() {
  return (
    <ProjectsModelProvider>
      <ProjectCreator />
      <ProjectTabs />
      <Tasks />
    </ProjectsModelProvider>
  );
}
