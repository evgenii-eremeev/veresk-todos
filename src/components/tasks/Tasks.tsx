import React from "react";
import { TaskList } from "./TaskList";
import { TaskModelProvider } from "./TaskModel";
import { TaskCreator } from "./TaskCreator";
import { TasksTitle } from "./TasksTitle";

export function Tasks() {
  return (
    <TaskModelProvider>
      <TasksTitle />
      <TaskCreator />
      <TaskList />
    </TaskModelProvider>
  );
}
