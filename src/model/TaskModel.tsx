import React, {
  createContext,
  PropsWithChildren,
  useContext,
  useState,
} from "react";
import { Task, TaskModel } from "../types/task-types";
import { Project } from "../types/project-types";

export function useTasks() {
  return useContext(TaskModelContext);
}

export function TaskModelProvider({ children }: PropsWithChildren) {
  const model = useTaskModel();
  return <TaskModelContext.Provider value={model} children={children} />;
}

const TaskModelContext = createContext<TaskModel>({
  tasks: [],
  setTasks: () => {},
  draft: "",
  setDraft: () => {},
  addTask: () => {},
  removeTask: () => {},
  toggleCompleted: () => {},
  projects: [],
  addNewProject: () => {},
  selectedProject: null,
  setSelectedProject: () => {},
});

function useTaskModel(): TaskModel {
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
    setSelectedProject
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
