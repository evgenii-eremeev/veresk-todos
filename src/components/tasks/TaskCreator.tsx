import React, { useState } from "react";
import { useProjects } from "../../model/useProjects";
import { Task } from "../../types/task-types";
import { Button } from "../common/Button";

interface Props {
  onDone?: () => void;
  task?: Task;
}
export function TaskCreator({ onDone = () => {}, task }: Props = {}) {
  const [draft, setDraft] = useState(task ? task.text : "");
  const { addTask, editTask, currentProject, isSharedProjectActive } =
    useProjects();
  const editMode = task != null;

  return (
    <form
      className="flex flex-auto"
      onSubmit={(event) => {
        event.preventDefault();
        if (!draft || !currentProject) return;
        if (editMode) {
          editTask(task.id, draft);
        } else {
          addTask({ text: draft, projectId: currentProject.id });
        }
        setDraft("");
        onDone();
      }}
    >
      <label htmlFor="task-text" className="hidden">
        {editMode ? "Edit task" : "Create new"}
      </label>
      <input
        autoFocus={editMode}
        id="task-text"
        className="flex-auto border-2 border-blue-400 rounded-md my-2 px-1"
        value={draft}
        onChange={(event) => setDraft(event.target.value)}
      />
      <Button type="submit" className="mx-2">
        {editMode ? "Done" : "Add"}
      </Button>
    </form>
  );
}
