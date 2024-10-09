import React from "react";
import { Tasks } from "../tasks/Tasks";
import { Projects } from "../projects/Projects";
import { TaskModelProvider } from "../../model/TaskModel";

export function App() {
  return (
    <TaskModelProvider>
      <Projects />
      <Tasks />
    </TaskModelProvider>
  );
}
