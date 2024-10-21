import React from "react";
import { useProjects } from "../../model/useProjects";
import { ModalLike } from "../common/ModalLike";

export function ProjectCreator() {
  const { addNewProject } = useProjects();

  return (
    <div>
      <ModalLike
        mainLabel={"New project"}
        secondaryLabel={"Create"}
        inputLabel={"Project name"}
        onSubmit={(project) => {
          addNewProject(project);
        }}
      />
    </div>
  );
}
