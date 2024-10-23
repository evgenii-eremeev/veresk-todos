import React from "react";
import { TaskListItem } from "./TaskListItem";
import { useProjects } from "../../model/useProjects";

export function TaskList() {
  const {
    tasks,
    removeTask,
    toggleTaskCompleted,
  } = useProjects();

  return (
    <ul>
      {[
        ...tasks.map((task) => (
          <TaskListItem
            key={task.id}
            task={task}
            onRemove={() => removeTask(task.id)}
            toggleCompleted={() => toggleTaskCompleted(task.id)}
          />
        )),
      ]}
    </ul>
  );
}
