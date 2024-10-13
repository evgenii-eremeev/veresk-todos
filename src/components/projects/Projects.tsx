import React from "react";
import { Tasks } from "../tasks/Tasks";
import { ProjectsModelProvider } from "../../model/ProjectsModel";
import { ProjectCreator } from "./ProjectCreator";
import { ProjectTabs } from "./ProjectTabs";
import { Persist } from "../../types/persist-types";

export function Projects({ persist }: { persist: Persist }) {
  return (
    <ProjectsModelProvider persist={persist}>
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
