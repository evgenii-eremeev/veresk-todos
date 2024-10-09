import { render, screen } from "@testing-library/react";
import React from "react";
import userEvent from "@testing-library/user-event";
import { Projects } from "../Projects";

describe("Projects", () => {
  it("should not create a project with empty name", async () => {
    render(<Projects />);
    const projects = screen.getByRole("list");

    await userEvent.click(screen.getByText("New project"));
    expect(projects.children).toHaveLength(0);
  });

  it("should have create form appear after new project button is clicked", async () => {
    render(<Projects />);
    expect(screen.queryByRole("form")).toBeNull();
    expect(screen.queryByRole("textbox")).toBeNull();
    expect(screen.queryByText("Create")).toBeNull();

    await userEvent.click(screen.getByText("New project"));
    expect(screen.queryByRole("form")).toBeTruthy();
    expect(screen.queryByRole("textbox")).toBeTruthy();
    expect(screen.queryByText("Create")).toBeTruthy();
  });

  it("should focus on input after clicking new project", async () => {
    render(<Projects />);
    await userEvent.click(screen.getByText("New project"));
    expect(screen.getByRole("textbox")).toBe(document.activeElement);
  });

  it("should hide project creating form after clicking create", async () => {
    render(<Projects />);
    await userEvent.click(screen.getByText("New project"));
    expect(screen.queryByRole("form")).toBeTruthy();
    await userEvent.click(screen.getByText("Create"));
    expect(screen.queryByRole("form")).toBeNull();
  });

  it("should add one project to the list of projects", async () => {
    render(<Projects />);
    const projects = screen.getByRole("list");

    await userEvent.click(screen.getByText("New project"));
    await userEvent.keyboard("Veresk{Enter}");
    expect(projects.children).toHaveLength(1);
    expect(projects.children[0].textContent).toBe("Veresk");
  });

  it("should add one project to the list of by clicking Create button", async () => {
    render(<Projects />);
    const projects = screen.getByRole("list");

    await userEvent.click(screen.getByText("New project"));
    await userEvent.type(screen.getByRole("textbox"), "Project 1");
    await userEvent.click(screen.getByText("Create"));
    expect(projects.children).toHaveLength(1);
    expect(projects.children[0].textContent).toBe("Project 1");
  });

  it("should add two projects to the list of projects", async () => {
    render(<Projects />);
    const projects = screen.getByRole("list");

    await userEvent.click(screen.getByText("New project"));
    await userEvent.keyboard("Veresk{Enter}");
    await userEvent.click(screen.getByText("New project"));
    await userEvent.keyboard("Candy{Enter}");
    expect(projects.children).toHaveLength(2);
    expect(projects.children[0].textContent).toBe("Candy");
    expect(projects.children[1].textContent).toBe("Veresk");
  });
});
