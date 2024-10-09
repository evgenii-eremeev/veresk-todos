import { Project } from "./project-types";

export interface Task {
  text: string;
  completed: boolean;
}

export interface TaskModel {
    tasks: Array<Task>;
    setTasks: (fn: (tasks: Array<Task>) => Array<Task>) => void;
    draft: string;
    setDraft: (draft: string) => void;
    addTask: () => void;
    removeTask: (index: number) => void;
    toggleCompleted: (index: number) => void;
    projects: Array<Project>;
    selectedProject: Project | null;
    addNewProject: (name: string) => void;
    setSelectedProject: (project: Project) => void;
  }