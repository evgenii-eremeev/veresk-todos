import React from "react";
import { TaskListItem } from "./TaskListItem";
import { useProjects } from "../../model/ProjectsModel";

export function TaskList() {
  const { tasks, removeTask, toggleCompleted } = useProjects();
  return (
    <ul>
      {[
        ...tasks.map((task, index) => (
          <TaskListItem
            key={task.text + index}
            task={task}
            onRemove={() => removeTask(index)}
            toggleCompleted={() => toggleCompleted(index)}
          />
        )),
      ]}
    </ul>
  );
}
