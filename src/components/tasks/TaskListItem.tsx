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
    <li className="flex items-center">
      <input
        className="mx-1"
        type="checkbox"
        checked={task.completed}
        onChange={toggleCompleted}
      />
      <span className={clsx("flex-auto", { "line-through": task.completed })}>{task.text}</span>
      <button
        className="border-2 border-black rounded-md text-sm px-1 mx-2 my-1"
        onClick={onRemove}
      >
        Delete
      </button>
    </li>
  );
}
