import clsx from "clsx";
import React, { useState } from "react";
import { Task } from "../../types/task-types";
import { TaskCreator } from "./TaskCreator";
import { Button } from "../common/Button";

export function TaskListItem({
  task,
  onRemove,
  toggleCompleted,
}: {
  task: Task;
  onRemove: () => void;
  toggleCompleted: () => void;
}) {
  const [editing, setEditing] = useState(false);
  return (
    <li className="flex items-center">
      {editing ? (
        <TaskCreator onDone={() => setEditing(false)} task={task} />
      ) : (
        <>
          <input
            className="mx-1"
            type="checkbox"
            checked={task.completed}
            onChange={toggleCompleted}
          />
          <span
            className={clsx("flex-auto", { "line-through": task.completed })}
          >
            {task.text}
          </span>
          <Button className="text-sm mr-2" onClick={() => setEditing(true)}>
            Edit
          </Button>
          <Button className="text-sm mr-2" onClick={onRemove}>
            Delete
          </Button>
        </>
      )}
    </li>
  );
}
