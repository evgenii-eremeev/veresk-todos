import userEvent from "@testing-library/user-event";
import { screen } from "@testing-library/react";
import { Persist } from "../types/persist-types";

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

export class PersistMock implements Persist {
  store: Record<string, string>;
  constructor(store: Record<string, string> = {}) {
    this.store = { ...store };
  }
  set(key: string, value: string) {
    this.store[key] = value;
  }
  get(key: string) {
    return this.store[key];
  }
}
