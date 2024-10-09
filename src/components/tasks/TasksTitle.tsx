import React from "react";
import { useProjects } from "../../model/ProjectsModel";

export function TasksTitle() {
  const { currentProject } = useProjects();
  return <h2 className="text-center font-bold text-lg">{currentProject?.name ?? 'Tasks'}</h2>;
}
