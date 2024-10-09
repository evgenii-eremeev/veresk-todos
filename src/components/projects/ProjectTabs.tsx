import React from "react";
import { useProjects } from "../../model/ProjectsModel";
import clsx from "clsx";

export function ProjectTabs() {
  const { projects, currentProject, setCurrentProject } = useProjects();
  return (
    <ul role="tablist" className="m-3">
      {projects.map((project, index) => (
        <li
          role="tab"
          className={clsx("cursor-pointer", {
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
