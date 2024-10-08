import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Tasks } from "../Tasks";
import React from "react";

describe("Tasks", () => {
  it("should have a heading", async () => {
    render(<Tasks />);

    const heading = screen.getByRole("heading", { level: 2 });
    expect(heading.textContent).toBe("Tasks");
  });

  it("shuld render empty task list", async () => {
    render(<Tasks />);
    const tasks = screen.getByRole("list");
    expect(tasks.children).toHaveLength(0);
  });

  it("should have an input and add tasks with input's content", async () => {
    render(<Tasks />);

    const input: HTMLInputElement = screen.getByRole("textbox");
    await addTasks(["task 1"]);

    expect(await screen.findByText("task 1")).toBeTruthy();
    expect(input.value).toBe("");
  });

  it("should have a checkbox", async () => {
    render(<Tasks />);

    await addTasks(["task 1", "task 2"]);

    const [checkbox1] = screen.getAllByRole("checkbox");
    const task1 = screen.getByText("task 1");
    const task2 = screen.getByText("task 2");

    expect(task1.classList.contains("line-through")).toBe(false);
    await userEvent.click(checkbox1);
    expect(task1.classList.contains("line-through")).toBe(true);
    expect(task2.classList.contains("line-through")).toBe(false);
  });

  it("should not create empty text task", async () => {
    render(<Tasks />);
    const tasks = screen.getByRole("list");

    await userEvent.click(screen.getByText("Add"));
    expect(tasks.children).toHaveLength(0);
  });

  it("should be able to add many tasks", async () => {
    render(<Tasks />);
    const tasks = screen.getByRole("list");
    await addTasks(["task 1", "task 2"]);

    expect(tasks.children).toHaveLength(2);
    expect(tasks.children[0].textContent).toContain("task 1");
    expect(tasks.children[1].textContent).toContain("task 2");
  });

  it("should add task on Enter", async () => {
    render(<Tasks />);
    const tasks = screen.getByRole("list");

    screen.getByRole("textbox").focus();
    await userEvent.keyboard("task A{Enter}");

    expect(tasks.children).toHaveLength(1);
    expect(tasks.children[0].textContent).toContain("task A");
  });

  it("should focus on input by clicking the label", async () => {
    render(<Tasks />);
    const tasks = screen.getByRole("list");

    await userEvent.click(screen.getByText("Create new"));
    await userEvent.keyboard("task{Enter}");

    expect(tasks.children).toHaveLength(1);
    expect(tasks.children[0].textContent).toContain("task");
  });


  it("should remove task on remove button click", async () => {
    render(<Tasks />);
    const tasks = screen.getByRole("list");
    await addTasks(["task 1", "task 2"]);

    const [removeBtn1] = await screen.findAllByText("Delete");
    await userEvent.click(removeBtn1);

    expect(tasks.children).toHaveLength(1);
    expect(tasks.children[0].textContent).toContain("task 2");
  });
});

async function addTasks(taskNames: Array<string>) {
  const draftInput = screen.getByRole("textbox");
  const addButton = screen.getByText("Add");

  for (const taskName of taskNames) {
    await userEvent.type(draftInput, taskName);
    await userEvent.click(addButton);
  }
}
