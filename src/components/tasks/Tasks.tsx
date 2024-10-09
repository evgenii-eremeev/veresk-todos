import React from "react";
import { TaskList } from "./TaskList";
import { useProjects } from "../../model/ProjectsModel";
import { TaskCreator } from "./TaskCreator";
import { TasksTitle } from "./TasksTitle";

export function Tasks() {
  const { currentProject } = useProjects();
  return (
    currentProject && (
      <>
        <TasksTitle />
        <TaskList />
        <TaskCreator />
      </>
    )
  );
}
