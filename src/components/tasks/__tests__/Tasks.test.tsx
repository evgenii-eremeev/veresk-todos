import { render, screen, within } from "@testing-library/react";
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
    await userEvent.type(input, "task 1");
    await userEvent.click(screen.getByText("Add"));

    expect(await screen.findByText("task 1")).toBeTruthy();
    expect(input.value).toBe("");
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
    const draftInput = screen.getByRole("textbox");
    const addButton = screen.getByText("Add");

    await userEvent.type(draftInput, "task 1");
    await userEvent.click(screen.getByText("Add"));

    expect(tasks.children).toHaveLength(1);

    await userEvent.type(draftInput, "task 2");
    await userEvent.click(screen.getByText("Add"));

    expect(tasks.children).toHaveLength(2);
    expect(tasks.children[0].textContent).toContain("task 1");
    expect(tasks.children[1].textContent).toContain("task 2");
  });

  it("should remove task on remove button click", async () => {
    render(<Tasks />);
    const tasks = screen.getByRole("list");
    const input = screen.getByRole("textbox");
    const add = screen.getByText("Add");

    await userEvent.type(input, "task 1");
    await userEvent.click(add);

    await userEvent.type(input, "task 2");
    await userEvent.click(add);

    const [removeBtn1] = await screen.findAllByText("Remove");
    await userEvent.click(removeBtn1);

    expect(tasks.children).toHaveLength(1);
    expect(tasks.children[0].textContent).toContain("task 2");
  });
});
