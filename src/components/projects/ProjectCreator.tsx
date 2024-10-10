import React, { useState } from "react";
import { useProjects } from "../../model/ProjectsModel";
import { Button } from "../common/Button";

export function ProjectCreator() {
  const [creating, setCreating] = useState(false);
  const [newProjectName, setNewProjectName] = useState("");
  const { addNewProject } = useProjects();

  return (
    <div>
      <Button
        className=" border-yellow-500 m-2"
        onClick={() => setCreating(true)}
      >
        New project
      </Button>
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
          <Button type="submit">Create</Button>
        </form>
      )}
    </div>
  );
}
