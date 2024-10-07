
export interface Task {
  text: string;
}

export interface TaskModel {
    tasks: Array<Task>;
    setTasks: (fn: (tasks: Array<Task>) => Array<Task>) => void;
    draft: string;
    setDraft: (draft: string) => void;
    addTask: () => void;
    removeTask: (index: number) => void;
  }