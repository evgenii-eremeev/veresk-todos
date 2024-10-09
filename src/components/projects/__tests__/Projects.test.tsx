import { render, screen } from "@testing-library/react";
import React from "react";
import userEvent from "@testing-library/user-event";
import { Projects as UnwrappedProjects } from "../Projects";
import { hasClass } from "../../../utils/testing";
import { ProjectsModelProvider } from "../../../model/ProjectsModel";

function Projects() {
    return (
      <ProjectsModelProvider>
        <UnwrappedProjects />
      </ProjectsModelProvider>
    );
  }

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

    await addProjects(["Veresk"]);
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

    await addProjects(["Veresk", "Candy"]);
    expect(projects.children).toHaveLength(2);
    expect(projects.children[0].textContent).toBe("Candy");
    expect(projects.children[1].textContent).toBe("Veresk");
  });

  it("should select project by clicking", async () => {
    render(<Projects />);
    await addProjects(["Veresk", "Candy"]);
    expect(hasClass(screen.getByText("Candy"), "font-bold")).toBe(true);
    await userEvent.click(screen.getByText("Veresk"));
    expect(hasClass(screen.getByText("Veresk"), "font-bold")).toBe(true);
    expect(hasClass(screen.getByText("Candy"), "font-bold")).toBe(false);
  });

  it("should not rely on project name as uniq identificator", async () => {
    render(<Projects />);
    await addProjects(["Metoo", "Metoo"]);

    const [first, second] = screen.getAllByText("Metoo")
    await userEvent.click(second);
    expect(hasClass(first, "font-bold")).toBe(false);
    expect(hasClass(second, "font-bold")).toBe(true);
  });

  xit('should display tasks after project is created', async () => {
    render(<Projects />);
    await addProjects(["Veresk"]);
    const heading = screen.getByRole("heading", { level: 2 });
    expect(heading.textContent).toBe("Tasks");
  })
});

async function addProjects(projectNames: Array<string>) {
  for (const projectName of projectNames) {
    await userEvent.click(screen.getByText("New project"));
    await userEvent.keyboard(`${projectName}{Enter}`);
  }
}

