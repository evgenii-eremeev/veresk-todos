import React from "react";
import { TaskListItem } from "./TaskListItem";
import { useProjects } from "../../model/useProjects";

export function TaskList() {
  const {
    tasks: ownTasks,
    sharedTasks,
    currentProject,
    sharedProjects,
    removeTask,
    toggleTaskCompleted,
  } = useProjects();

  const isSharedProject = sharedProjects.find(
    (project) => project.id == currentProject?.id
  );
  const tasks = isSharedProject ? sharedTasks : ownTasks;
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
