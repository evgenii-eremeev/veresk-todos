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

  const { setProjectsPersist, setTasksPersist } = usePersistance({
    persist,
    setProjects,
    setTasks,
    onStateLoaded({ projects }) {
      setCurrentProject(projects[0] ?? null);
    },
  });

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
    setTasksPersist((tasks) => [...tasks, createNewTask(text, projectId)]);
  }

  function editTask(taskId: string, text: string) {
    updateTask(taskId, () => ({ text }));
  }

  function removeTask(taskId: string) {
    setTasksPersist((tasks) => tasks.filter((task) => task.id != taskId));
  }

  function toggleTaskCompleted(taskId: string) {
    updateTask(taskId, (task) => ({ completed: !task.completed }));
  }

  function updateTask(
    taskId: string,
    updater: (task: Task) => Partial<Omit<Task, "id" | "projectId">>
  ) {
    setTasksPersist((tasks) =>
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
    setProjectsPersist((projects) => [project, ...projects]);
  }

  function removeProject(projectId: string) {
    setProjectsPersist((projects) =>
      projects.filter((project) => project.id != projectId)
    );
  }
}

function usePersistance({
  persist,
  setProjects,
  setTasks,
  onStateLoaded,
}: {
  persist: Persist;
  setProjects: React.Dispatch<React.SetStateAction<Project[]>>;
  setTasks: React.Dispatch<React.SetStateAction<Task[]>>;
  onStateLoaded: ({
    projects,
    tasks,
  }: {
    projects: Project[];
    tasks: Task[];
  }) => void;
}) {
  useEffect(() => {
    loadState().then(onStateLoaded);
  }, []);

  async function loadState() {
    const projects = await persist.getParsed<Project[]>("projects", []);
    const tasks = await persist.getParsed<Task[]>("tasks", []);

    setProjects(projects);
    setTasks(tasks);
    return { projects, tasks };
  }

  return {
    setProjectsPersist: (updater: (projects: Project[]) => Project[]) => {
      setProjects((projects) => {
        const updated = updater(projects);
        persist.set("projects", JSON.stringify(updated)).catch(console.error);
        return updated;
      });
    },
    setTasksPersist: (updater: (tasks: Task[]) => Task[]) => {
      setTasks((tasks) => {
        const updated = updater(tasks);
        persist.set("tasks", JSON.stringify(updated)).catch(console.error);
        return updated;
      });
    },
  };
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
