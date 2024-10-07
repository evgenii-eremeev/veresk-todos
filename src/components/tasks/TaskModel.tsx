import React, { createContext, PropsWithChildren, useContext, useState } from "react";
import { Task, TaskModel } from "./types";


export function useTasks() {
  return useContext(TaskModelContext);
}

export function TaskModelProvider({ children }: PropsWithChildren) {
  const model = useTaskModel();
  return <TaskModelContext.Provider value={model} children={children} />;
}

const TaskModelContext = createContext<TaskModel>({
  tasks: [],
  setTasks: () => {},
  draft: "",
  setDraft: () => {},
  addTask: () => {},
  removeTask: () => {},
});


function useTaskModel(): TaskModel {
  const [tasks, setTasks] = useState<Array<Task>>([]);
  const [draft, setDraft] = useState("");

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


