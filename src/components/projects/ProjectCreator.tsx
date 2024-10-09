import React, { useState } from "react";
import { useProjects } from "../../model/ProjectsModel";

export function ProjectCreator() {
  const [creating, setCreating] = useState(false);
  const [newProjectName, setNewProjectName] = useState("");
  const { addNewProject } = useProjects();

  return (
    <>
      <button onClick={() => setCreating(true)}>New project</button>
      {creating && (
        <form
          role="form"
          onSubmit={(event) => {
            event.preventDefault();
            addNewProject(newProjectName);
            setCreating(false);
            setNewProjectName("");
          }}
        >
          <label htmlFor="project-name">Project name</label>
          <input
            id="project-name"
            autoFocus
            value={newProjectName}
            onChange={(event) => setNewProjectName(event.target.value)}
          />
          <button type="submit">Create</button>
        </form>
      )}
    </>
  );
}
