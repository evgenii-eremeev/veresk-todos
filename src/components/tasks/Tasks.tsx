import React from "react";
import { TaskList } from "./TaskList";
import { ProjectsModelProvider } from "../../model/ProjectsModel";
import { TaskCreator } from "./TaskCreator";
import { TasksTitle } from "./TasksTitle";

export function Tasks() {
  return (
    <>
      <TasksTitle />
      <TaskCreator />
      <TaskList />
    </>
  );
}
