import React, { useState } from "react";
import { useProjects } from "../../model/ProjectsModel";

export function TaskCreator() {
  const [draft, setDraft] = useState("");
  const { addTask, currentProject } = useProjects();
  return (
    <form
      className="flex"
      onSubmit={(event) => {
        event.preventDefault();
        if (!draft || !currentProject) return;
        addTask(draft, currentProject.id);
        setDraft("")
      }}
    >
      <label htmlFor="create-task" className="hidden">Create new</label>
      <input
        id="create-task"
        className="flex-auto border-2 border-blue-400 rounded-md my-2 px-1"
        value={draft}
        onChange={(event) => setDraft(event.target.value)}
      />
      <button
        type="submit"
        className="border-2 border-blue-600 rounded-md m-2 px-2"
      >
        Add
      </button>
    </form>
  );
}
