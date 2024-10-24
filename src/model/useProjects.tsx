import React, {
  createContext,
  MutableRefObject,
  PropsWithChildren,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import { Task } from "../types/task-types";
import { Project } from "../types/project-types";
import { randomStringOfNumbers } from "../utils/random";
import { Persist } from "../types/persist-types";
import { EventEmitter } from "events";

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

type TaskUpdater = (task: Task) => Partial<Omit<Task, "id" | "projectId">>;

export interface ProjectsModel {
  tasks: Array<Task>;
  addTask: (
    partialTask: { text: string; projectId: string; id?: string },
    emit?: boolean
  ) => void;
  editTask: (taskId: string, text: string) => void;
  removeTask: (taskId: string, emit?: boolean) => void;
  toggleTaskCompleted: (taskId: string) => void;
  projects: Array<Project>;
  sharedProjects: Array<Project>;
  currentProject: Project | null;
  isSharedProjectActive: boolean;
  addNewProject: (name: string) => void;
  setCurrentProjectId: (projectId: string | null) => void;
  removeProject: (projectId: string) => void;
  setProjectTopic: (projectId: string, topic: string) => void;
  addSharedProject: (project: Project, task: Task[]) => void;
  eventsRef: MutableRefObject<EventEmitter>;
  updateTask: (taskId: string, updater: TaskUpdater, emit?: boolean) => void;
}

function useProjectsModel({ persist }: { persist: Persist }): ProjectsModel {
  const [ownTasks, setOwnTasks] = useState<Array<Task>>([]);

  const [projects, setProjects] = useState<Array<Project>>([]);
  const [currentProjectId, setCurrentProjectId] = useState<string | null>("");
  const [sharedProjects, setSharedProjects] = useState<Array<Project>>([]);
  const [sharedTasks, setSharedTasks] = useState<Task[]>([]);

  const currentProject =
    [...projects, ...sharedProjects].find(
      (propject) => propject.id === currentProjectId
    ) ?? null;

  const isSharedProjectActive = isSharedProject(currentProjectId);

  const eventsRef = useRef(new EventEmitter());

  const { setProjectsPersist, setTasksPersist } = usePersistance({
    persist,
    setProjects,
    setTasks: setOwnTasks,
    onStateLoaded({ projects }) {
      setCurrentProjectId(projects[0]?.id ?? null);
    },
  });

  function isSharedProject(projectId: string | null) {
    return (
      sharedProjects.filter((project) => project.id == projectId).length === 1
    );
  }

  function addTask(
    { text, projectId, id }: { text: string; projectId: string; id?: string },
    emit = true
  ) {
    const task = createNewTask(text, projectId, id);
    if (isSharedProject(projectId)) {
      setSharedTasks((tasks) => [...tasks, task]);
    } else {
      setTasksPersist((tasks) => [...tasks, task]);
    }
    emit && eventsRef.current.emit("task-add", task);
  }

  function editTask(taskId: string, text: string) {
    updateTask(taskId, () => ({ text }));
  }

  function removeTask(taskId: string, emit: boolean = true) {
    setTasksPersist((tasks) => tasks.filter((task) => task.id != taskId));
    setSharedTasks((tasks) => tasks.filter((task) => task.id != taskId));
    emit && eventsRef.current.emit("task-delete", taskId);
  }

  function toggleTaskCompleted(taskId: string) {
    updateTask(taskId, (task) => ({ completed: !task.completed }));
  }

  function updateTask(
    taskId: string,
    updater: TaskUpdater,
    emit: boolean = true
  ) {
    setTasksPersist((tasks) =>
      tasks.map((task) => {
        if (task.id == taskId) {
          const updatedTask = {
            ...task,
            ...updater(task),
          };
          emit && eventsRef.current.emit("task-update", updatedTask);
          return updatedTask;
        } else {
          return task;
        }
      })
    );
    setSharedTasks((sharedTasks) =>
      sharedTasks.map((task) => {
        if (task.id == taskId) {
          const updatedTask = {
            ...task,
            ...updater(task),
          };
          emit && eventsRef.current.emit("task-update", updatedTask);
          return updatedTask;
        } else {
          return task;
        }
      })
    );
  }

  function addNewProject(projectName: string) {
    const project = createNewProject(projectName);
    addProject(project);
    setCurrentProjectId(project.id);
  }

  function addProject(project: Project) {
    setProjectsPersist((projects) => [project, ...projects]);
  }

  function removeProject(projectId: string) {
    setProjectsPersist((projects) =>
      projects.filter((project) => project.id != projectId)
    );
  }

  function updateProject(
    projectId: string,
    updater: (project: Project) => Partial<Project>
  ) {
    setProjectsPersist((projects) =>
      projects.map((project) =>
        project.id == projectId ? { ...project, ...updater(project) } : project
      )
    );
  }

  function setProjectTopic(projectId: string, topic: string) {
    updateProject(projectId, () => ({ topic }));
  }

  function addSharedProject(project: Project, tasks: Task[]) {
    setSharedProjects((projects) => [...projects, project]);
    setSharedTasks((sharedTasks) => [...sharedTasks, ...tasks]);
  }

  const tasks = isSharedProjectActive ? sharedTasks : ownTasks;

  return {
    tasks: tasks.filter((task) => task.projectId == currentProject?.id),
    addTask,
    editTask,
    removeTask,
    toggleTaskCompleted,
    projects,
    sharedProjects,
    currentProject,
    isSharedProjectActive,
    addNewProject,
    addSharedProject,
    setCurrentProjectId,
    removeProject,
    setProjectTopic,
    eventsRef,
    updateTask,
  };
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

export function createNewTask(
  text: string,
  projectId: string,
  id = randomStringOfNumbers()
): Task {
  return { text, id, projectId, completed: false };
}

export function createNewProject(name: string): Project {
  return {
    name,
    id: randomStringOfNumbers(),
    topic: null,
  };
}
