import clsx from "clsx";
import React, { useState } from "react";
import { Task } from "../../types/task-types";

export function TaskListItem({
  task,
  onRemove,
  toggleCompleted
}: {
  task: Task;
  onRemove: () => void;
  toggleCompleted: () => void;
}) {
  return (
    <li className="m-4">
      <input
        className="mx-1"
        type="checkbox"
        checked={task.completed}
        onChange={toggleCompleted}
      />
      <span className={clsx({ "line-through": task.completed })}>{task.text}</span>
      <button
        className="mx-2 border-2 border-black rounded-md px-1 text-sm"
        onClick={onRemove}
      >
        Delete
      </button>
    </li>
  );
}
