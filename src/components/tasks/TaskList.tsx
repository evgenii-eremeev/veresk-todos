import React from "react";
import { TaskListItem } from "./TaskListItem";
import { useTasks } from "./TaskModel";

export function TaskList() {
  const { tasks, removeTask } = useTasks();
  return (
    <ul>
      {[
        ...tasks.map(({ text }, index) => (
          <TaskListItem
            key={text + index}
            text={text}
            onRemove={() => removeTask(index)}
          />
        )),
      ]}
    </ul>
  );
}
