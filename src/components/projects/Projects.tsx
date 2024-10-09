import React, { useState } from "react";

interface Project {
  name: string;
}

export function Projects() {
  const [creating, setCreating] = useState(false);
  const [newProjectName, setNewProjectName] = useState("");
  const [projects, setProjects] = useState<Array<Project>>([]);

  return (
    <div>
      <button onClick={() => setCreating(true)}>New project</button>
      {creating && (
        <form
          role="form"
          onSubmit={(event) => {
            event.preventDefault();
            addNewProject();
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
          <li key={project.name + index}>{project.name}</li>
        ))}
      </ul>
    </div>
  );

  function addNewProject() {
    setCreating(false);
    addProject(createProject(newProjectName));
    setNewProjectName("");
  }

  function addProject(project: Project) {
    setProjects((projects) => [project, ...projects]);
  }
}

function createProject(name: string): Project {
  return {
    name,
  };
}
