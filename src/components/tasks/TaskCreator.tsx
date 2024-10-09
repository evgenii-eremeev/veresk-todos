import React, { useState } from "react";
import { useProjects } from "../../model/ProjectsModel";

export function TaskCreator() {
  const [draft, setDraft] = useState("");
  const { addTask } = useProjects();
  return (
    <form
      onSubmit={(event) => {
        event.preventDefault();
        if (!draft) return;
        addTask(draft);
        setDraft("")
      }}
    >
      <label htmlFor="create-task">Create new</label>
      <input
        id="create-task"
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
