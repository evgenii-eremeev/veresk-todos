import React from "react";
import { Task } from "./types";
import { TaskList } from "./TaskList";

export function Tasks() {
  const [tasks, setTasks] = React.useState<Array<Task>>([]);
  const [draft, setDraft] = React.useState("");
  return (
    <div>
      <h2>Tasks</h2>
      <input value={draft} onChange={onDraftChange} />
      <button onClick={onAdd}>Add</button>
      <TaskList tasks={tasks} removeTask={removeTask} />
    </div>
  );

  function onDraftChange(event: React.ChangeEvent<HTMLInputElement>) {
    setDraft(event.target.value);
  }

  function onAdd() {
    if (!draft) return;

    setTasks((tasks) => [...tasks, { text: draft }]);
    setDraft("");
  }

  function removeTask(index: number) {
    setTasks((tasks) => tasks.filter((_, i) => i != index));
  }
}
