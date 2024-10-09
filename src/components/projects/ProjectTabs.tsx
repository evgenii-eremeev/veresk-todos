import React from "react";
import { useProjects } from "../../model/ProjectsModel";
import clsx from "clsx";

export function ProjectTabs() {
    const { projects, selectedProject, setSelectedProject } = useProjects();
    return (
      <ul role="tablist">
        {projects.map((project, index) => (
          <li
            className={clsx({
              "font-bold": project.id == selectedProject?.id,
            })}
            onClick={() => setSelectedProject(project)}
            key={project.name + index}
          >
            {project.name}
          </li>
        ))}
      </ul>
    );
  }