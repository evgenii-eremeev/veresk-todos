import clsx from "clsx";
import React, { useState } from "react";
import { Tasks } from "../tasks/Tasks";
import { useTasks } from "../../model/TaskModel";

export function Projects() {
  const [creating, setCreating] = useState(false);
  const [newProjectName, setNewProjectName] = useState("");
  const {projects, addNewProject, selectedProject, setSelectedProject} = useTasks();

  return (
    <div>
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
          <input
            autoFocus
            value={newProjectName}
            onChange={(event) => setNewProjectName(event.target.value)}
          />
          <button type="submit">Create</button>
        </form>
      )}
      <ul>
        {projects.map((project, index) => (
          <li
            className={clsx({
              "font-bold": project.name == selectedProject?.name,
            })}
            onClick={() => setSelectedProject(project)}
            key={project.name + index}
          >
            {project.name}
          </li>
        ))}
      </ul>
    </div>
  );


}
