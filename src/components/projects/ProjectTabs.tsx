import React from "react";
import { useProjects } from "../../model/useProjects";
import clsx from "clsx";

export function ProjectTabs() {
  const { projects, currentProject, setCurrentProjectId } = useProjects();
  return (
    <ul role="tablist" className="m-3">
      {projects.map((project, index) => (
        <li
          role="tab"
          className={clsx("cursor-pointer", {
            "font-bold": project.id == currentProject?.id,
          })}
          onClick={() => setCurrentProjectId(project.id)}
          key={project.name + index}
        >
          {project.name}
        </li>
      ))}
    </ul>
  );
}
