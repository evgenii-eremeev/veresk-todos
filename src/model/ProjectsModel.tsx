import React, {
  createContext,
  PropsWithChildren,
  useContext,
  useState,
} from "react";
import { Task } from "../types/task-types";
import { ProjectsModel } from "../types/project-types";
import { Project } from "../types/project-types";

export function useProjects(): ProjectsModel {
  const model = useContext(ProjectsModelContext);
  if (!model) {
		throw new Error('useProjects must be used within a ProjectsModelProvider')
	}
  else return model;
}

export function ProjectsModelProvider({ children }: PropsWithChildren) {
  const model = useProjectsModel();
  return <ProjectsModelContext.Provider value={model} children={children} />;
}

const ProjectsModelContext = createContext<ProjectsModel | null>(null);

function useProjectsModel(): ProjectsModel {
  const [tasks, setTasks] = useState<Array<Task>>([]);
  const [draft, setDraft] = useState("");
  const [projects, setProjects] = useState<Array<Project>>([]);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);

  return {
    tasks,
    setTasks,
    draft,
    setDraft,
    addTask,
    removeTask,
    toggleCompleted,
    projects,
    selectedProject,
    addNewProject,
    setSelectedProject,
  };

  function addTask() {
    if (!draft) return;

    setTasks((tasks) => [...tasks, createNewTask(draft)]);
    setDraft("");
  }

  function removeTask(index: number) {
    setTasks((tasks) => tasks.filter((_, i) => i != index));
  }

  function toggleCompleted(index: number) {
    setTasks((tasks) =>
      tasks.map((task, idx) => {
        if (idx == index) {
          return {
            ...task,
            completed: !task.completed,
          };
        } else {
          return task;
        }
      })
    );
  }

  function addNewProject(projectName: string) {
    const project = createNewProject(projectName);
    addProject(project);
    setSelectedProject(project);
  }

  function addProject(project: Project) {
    setProjects((projects) => [project, ...projects]);
  }
}

function createNewTask(text: string): Task {
  return { text, completed: false };
}

function createNewProject(name: string): Project {
  return {
    name,
  };
}
