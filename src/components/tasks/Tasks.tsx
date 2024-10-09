import React from "react";
import { TaskList } from "./TaskList";
import { TaskModelProvider } from "../../model/TaskModel";
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
