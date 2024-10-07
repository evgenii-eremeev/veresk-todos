import React from "react";
import { useTasks } from "./TaskModel";

export function TaskCreator() {
  const { draft, setDraft, addTask } = useTasks();
  return (
    <div>
      <input value={draft} onChange={(event) => setDraft(event.target.value)} />
      <button onClick={addTask}>Add</button>
    </div>
  );
}
