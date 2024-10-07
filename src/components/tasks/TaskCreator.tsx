import React from "react";
import { useTasks } from "./TaskModel";

export function TaskCreator() {
  const { draft, setDraft, addTask } = useTasks();
  return (
    <form
      onSubmit={(event) => {
        event.preventDefault()
        addTask();
      }}
    >
      <input
        className="border-2 border-blue-400 rounded-md mx-4 px-2 py-1"
        value={draft}
        onChange={(event) => setDraft(event.target.value)}
      />
      <button
        type="submit"
        className="border-2 border-blue-600 rounded-md px-2"
      >
        Add
      </button>
    </form>
  );
}
