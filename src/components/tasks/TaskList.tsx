import React from 'react';
import { TaskListItem } from "./TaskListItem";
import { Task } from "./types";

export function TaskList({
    tasks,
    removeTask,
  }: {
    tasks: Task[];
    removeTask: (index: number) => void;
  }) {
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