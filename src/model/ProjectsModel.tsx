import React, {
  createContext,
  PropsWithChildren,
  useContext,
  useEffect,
  useState,
} from "react";
import { Task } from "../types/task-types";
import { Project } from "../types/project-types";
import { randomStringOfNumbers } from "../utils/random";
import { Persist } from "../types/persist-types";

export interface ProjectsModel {
  tasks: Array<Task>;
  addTask: (projectId: string, text: string) => void;
  editTask: (taskId: string, text: string) => void;
  removeTask: (taskId: string) => void;
  toggleTaskCompleted: (taskId: string) => void;
  projects: Array<Project>;
  currentProject: Project | null;
  addNewProject: (name: string) => void;
  setCurrentProject: (project: Project | null) => void;
  removeProject: (projectId: string) => void;
}

export function useProjects(): ProjectsModel {
  const model = useContext(ProjectsModelContext);
  if (!model) {
    throw new Error("useProjects must be used within a ProjectsModelProvider");
  } else return model;
}

export function ProjectsModelProvider({
  children,
  persist,
}: PropsWithChildren<{ persist: Persist }>) {
  const model = useProjectsModel({ persist });
  return <ProjectsModelContext.Provider value={model} children={children} />;
}

const ProjectsModelContext = createContext<ProjectsModel | null>(null);

function useProjectsModel({ persist }: { persist: Persist }): ProjectsModel {
  const [tasks, setTasks] = useState<Array<Task>>([]);

  const [projects, setProjects] = useState<Array<Project>>([]);
  const [currentProject, setCurrentProject] = useState<Project | null>(null);

  usePersistance({ persist, setProjects, projects, tasks, setTasks });

  return {
    tasks: tasks.filter((task) => task.projectId == currentProject?.id),
    addTask,
    editTask,
    removeTask,
    toggleTaskCompleted,
    projects,
    currentProject,
    addNewProject,
    setCurrentProject,
    removeProject,
  };

  function addTask(projectId: string, text: string) {
    setTasks((tasks) => [...tasks, createNewTask(text, projectId)]);
  }

  function editTask(taskId: string, text: string) {
    updateTask(taskId, () => ({ text }));
  }

  function removeTask(taskId: string) {
    setTasks((tasks) => tasks.filter((task) => task.id != taskId));
  }

  function toggleTaskCompleted(taskId: string) {
    updateTask(taskId, (task) => ({ completed: !task.completed }));
  }

  function updateTask(
    taskId: string,
    updater: (task: Task) => Partial<Omit<Task, "id" | "projectId">>
  ) {
    setTasks((tasks) =>
      tasks.map((task) => {
        if (task.id == taskId) {
          return {
            ...task,
            ...updater(task),
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
    setCurrentProject(project);
  }

  function addProject(project: Project) {
    setProjects((projects) => [project, ...projects]);
  }

  function removeProject(projectId: string) {
    setProjects((projects) =>
      projects.filter((project) => project.id != projectId)
    );
  }
}

function usePersistance({
  persist,
  setProjects,
  setTasks,
  projects,
  tasks
}: {
  persist: Persist;
  setProjects: React.Dispatch<React.SetStateAction<Project[]>>;
  setTasks: React.Dispatch<React.SetStateAction<Task[]>>;
  projects: Project[];
  tasks: Task[];
}) {
  useEffect(() => {
    const projectsString = persist.get("projects");
    if (projectsString) {
      setProjects(JSON.parse(projectsString));
    }
    const tasksString = persist.get("tasks");
    if (tasksString) {
      setTasks(JSON.parse(tasksString));
    }
  }, []);

  useEffect(() => {
    persist.set("projects", JSON.stringify(projects));
  }, [projects]);

  useEffect(() => {
    persist.set("tasks", JSON.stringify(tasks));
  }, [tasks]);
}

export function createNewTask(text: string, projectId: string): Task {
  return { text, completed: false, id: randomStringOfNumbers(), projectId };
}

export function createNewProject(name: string): Project {
  return {
    name,
    id: randomStringOfNumbers(),
  };
}
