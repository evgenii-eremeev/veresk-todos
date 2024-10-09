import React, { useState } from "react";
import { useProjects } from "../../model/ProjectsModel";

export function ProjectCreator() {
  const [creating, setCreating] = useState(false);
  const [newProjectName, setNewProjectName] = useState("");
  const { addNewProject } = useProjects();

  return (
    <div>
      <button
        className="border-2 border-yellow-500 rounded-md m-2 p-1"
        onClick={() => setCreating(true)}
      >
        New project
      </button>
      {creating && (
        <form
          className="mx-2"
          role="form"
          onSubmit={(event) => {
            event.preventDefault();
            addNewProject(newProjectName);
            setCreating(false);
            setNewProjectName("");
          }}
        >
          <label className="hidden" htmlFor="project-name">
            Project name
          </label>
          <input
            id="project-name"
            className="p-1"
            autoFocus
            value={newProjectName}
            onChange={(event) => setNewProjectName(event.target.value)}
          />
          <button type="submit">Create</button>
        </form>
      )}
    </div>
  );
}
