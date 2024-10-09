import React from "react";
import { Tasks } from "../tasks/Tasks";
import { ProjectsModelProvider } from "../../model/ProjectsModel";
import { ProjectCreator } from "./ProjectCreator";
import { ProjectTabs } from "./ProjectTabs";

export function Projects() {
  return (
    <ProjectsModelProvider>
      <div className="grid grid-cols-12">
        <div className="col-span-3">
          <ProjectCreator />
          <ProjectTabs />
        </div>
        <div className="col-span-9">
          <Tasks />
        </div>
      </div>
    </ProjectsModelProvider>
  );
}
