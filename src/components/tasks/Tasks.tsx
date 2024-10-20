import React from "react";
import { TaskList } from "./TaskList";
import { useProjects } from "../../model/ProjectsModel";
import { TaskCreator } from "./TaskCreator";
import { TasksTitle } from "./TasksTitle";
import { Button } from "../common/Button";
import { Chat } from "../chat/Chat";

export function Tasks() {
  const { currentProject, setCurrentProject, removeProject, setProjectTopic } =
    useProjects();
  return (
    currentProject && (
      <>
        <TasksTitle />
        <TaskList />
        <TaskCreator />
        <Button
          className="text-sm"
          onClick={() => {
            removeProject(currentProject.id);
            setCurrentProject(null);
          }}
        >
          Delete project
        </Button>
        <Chat
          onTopicCreated={(topic) => setProjectTopic(currentProject.id, topic)}
          savedTopic={currentProject.topic}
        />
      </>
    )
  );
}
