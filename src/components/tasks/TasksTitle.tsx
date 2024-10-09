import React from "react";
import { useProjects } from "../../model/ProjectsModel";

export function TasksTitle() {
  const { selectedProject } = useProjects();
  return <h2 className="text-center">{selectedProject?.name ?? 'Tasks'}</h2>;
}
