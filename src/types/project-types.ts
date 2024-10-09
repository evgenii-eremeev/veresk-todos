import { Task } from "./task-types";

export interface Project {
  name: string;
}

export interface ProjectsModel {
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

