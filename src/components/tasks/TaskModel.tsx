import React, { PropsWithChildren, useContext } from "react";
import { Task, TaskModel } from "./types";


export function useTasks() {
  return React.useContext(TaskModelContext);
}

export function TaskModelProvider({ children }: PropsWithChildren) {
  const model = useTaskModel();
  return <TaskModelContext.Provider value={model} children={children} />;
}

const TaskModelContext = React.createContext<TaskModel>({
  tasks: [],
  setTasks: () => {},
  draft: "",
  setDraft: () => {},
  addTask: () => {},
  removeTask: () => {},
});


function useTaskModel(): TaskModel {
  const [tasks, setTasks] = React.useState<Array<Task>>([]);
  const [draft, setDraft] = React.useState("");

  return {
    tasks,
    setTasks,
    draft,
    setDraft,
    addTask,
    removeTask,
  };

  function addTask() {
    if (!draft) return;

    setTasks((tasks) => [...tasks, { text: draft }]);
    setDraft("");
  }

  function removeTask(index: number) {
    setTasks((tasks) => tasks.filter((_, i) => i != index));
  }
}


