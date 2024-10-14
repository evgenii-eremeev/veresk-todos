import userEvent from "@testing-library/user-event";
import { screen } from "@testing-library/react";
import { Persist } from "./persist";

export function hasClass(elem: HTMLElement, className: string) {
  return elem.classList.contains(className);
}

export async function addProjects(projectNames: Array<string>) {
  for (const projectName of projectNames) {
    await userEvent.click(screen.getByText("New project"));
    await userEvent.keyboard(`${projectName}{Enter}`);
  }
}

export async function addTasks(taskNames: Array<string>) {
  const draftInput = screen.getByRole("textbox");
  const addButton = screen.getByText("Add");

  for (const taskName of taskNames) {
    await userEvent.type(draftInput, taskName);
    await userEvent.click(addButton);
  }
}

export class PersistMock extends Persist {
  store: Record<string, string>;
  constructor(store: Record<string, string> = {}) {
    super()
    this.store = { ...store };
  }
  async set(key: string, value: string) {
    this.store[key] = value;
  }
  async get(key: string) {
    return this.store[key];
  }
}
