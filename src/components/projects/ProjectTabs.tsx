import React from "react";
import { useProjects } from "../../model/useProjects";
import clsx from "clsx";

interface Props {
  shared?: boolean;
}

export function ProjectTabs({ shared = false }: Props = {}) {
  const {
    projects: ownProjects,
    sharedProjects,
    currentProject,
    setCurrentProjectId,
  } = useProjects();
  const projects = shared ? sharedProjects : ownProjects;
  const testId = shared ? "shared-project-list" : "project-list";
  return (
    <ul data-testid={testId} role="tablist" className="m-3">
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
