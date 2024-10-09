import React from "react";
import { useProjects } from "../../model/ProjectsModel";
import clsx from "clsx";

export function ProjectTabs() {
  const { projects, currentProject, setCurrentProject } = useProjects();
  return (
    <ul role="tablist">
      {projects.map((project, index) => (
        <li
          className={clsx({
            "font-bold": project.id == currentProject?.id,
          })}
          onClick={() => setCurrentProject(project)}
          key={project.name + index}
        >
          {project.name}
        </li>
      ))}
    </ul>
  );
}
