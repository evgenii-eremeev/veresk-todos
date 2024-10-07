import React from "react";
import { TaskListItem } from "./TaskListItem";
import { useTasks } from "./TaskModel";

export function TaskList() {
  const { tasks, removeTask, toggleCompleted } = useTasks();
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
