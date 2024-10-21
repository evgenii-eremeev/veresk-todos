import { render, screen, within } from "@testing-library/react";
import React from "react";
import userEvent from "@testing-library/user-event";
import { Projects } from "../Projects";
import {
  addProjects,
  addTasks,
  hasClass,
  PersistMock,
  SwarmMock,
} from "../../../utils/testing";
import { createNewProject, createNewTask } from "../../../model/ProjectsModel";
import { Persist } from "../../../types/persist-types";
import { createTopic as originalCreateTopic } from "../../../backend/swarm";
import { CreateTopic } from "../../../model/SwarmModel";
import { Peer, Swarm } from "../../../types/swarm-types";

function renderProjects({
  persist = new PersistMock(),
  createTopic = originalCreateTopic,
  swarm = new SwarmMock(),
}: {
  persist?: Persist;
  createTopic?: CreateTopic;
  swarm?: Swarm;
} = {}) {
  render(
    <Projects persist={persist} swarm={swarm} createTopic={createTopic} />
  );
}

describe("Projects", () => {
  it("should not create a project with empty name", async () => {
    renderProjects();
    const projects = await screen.findByRole("tablist");
    await userEvent.click(screen.getByText("New project"));
    await userEvent.click(screen.getByText("Create"));

    expect(projects.children).toHaveLength(0);
  });

  it("should have create form appear after new project button is clicked", async () => {
    renderProjects();
    expect(screen.queryByRole("form")).toBeNull();
    expect(screen.queryByLabelText("Project name")).toBeNull();
    expect(screen.queryByText("Create")).toBeNull();

    await userEvent.click(screen.getByText("New project"));
    expect(screen.queryByRole("form")).toBeTruthy();
    expect(screen.queryByLabelText("Project name")).toBeTruthy();
    expect(screen.queryByText("Create")).toBeTruthy();
  });

  it("should focus on input after clicking new project", async () => {
    renderProjects();
    await userEvent.click(screen.getByText("New project"));
    expect(screen.queryByLabelText("Project name")).toBe(
      document.activeElement
    );
  });

  it("should hide project creating form after clicking create", async () => {
    renderProjects();
    await userEvent.click(screen.getByText("New project"));
    expect(screen.queryByRole("form")).toBeTruthy();
    await userEvent.keyboard("my project {Enter}");
    expect(screen.queryByRole("form")).toBeNull();
  });

  it("should add one project to the list of projects", async () => {
    renderProjects();
    const projects = screen.getByRole("tablist");

    await addProjects(["Veresk"]);
    expect(projects.children).toHaveLength(1);
    expect(projects.children[0].textContent).toBe("Veresk");
  });

  it("should add one project to the list of by clicking Create button", async () => {
    renderProjects();
    const projects = screen.getByRole("tablist");

    await userEvent.click(screen.getByText("New project"));
    await userEvent.type(screen.getByLabelText("Project name"), "Project 1");
    await userEvent.click(screen.getByText("Create"));
    expect(projects.children).toHaveLength(1);
    expect(projects.children[0].textContent).toBe("Project 1");
  });

  it("should add two projects to the list of projects", async () => {
    renderProjects();
    const projects = screen.getByRole("tablist");

    await addProjects(["Veresk", "Candy"]);
    expect(projects.children).toHaveLength(2);
    expect(projects.children[0].textContent).toBe("Candy");
    expect(projects.children[1].textContent).toBe("Veresk");
  });

  it("should select project by clicking", async () => {
    renderProjects();
    await addProjects(["Veresk", "Candy"]);
    const projects = screen.getByRole("tablist");

    expect(hasClass(within(projects).getByText("Candy"), "font-bold")).toBe(
      true
    );
    await userEvent.click(screen.getByText("Veresk"));
    expect(hasClass(within(projects).getByText("Veresk"), "font-bold")).toBe(
      true
    );
    expect(hasClass(within(projects).getByText("Candy"), "font-bold")).toBe(
      false
    );
  });

  it("should not rely on project name as uniq identificator", async () => {
    renderProjects();
    await addProjects(["Metoo", "Metoo"]);

    const [first, second] = screen.getAllByText("Metoo");
    await userEvent.click(second);
    expect(hasClass(first, "font-bold")).toBe(false);
    expect(hasClass(second, "font-bold")).toBe(true);
  });

  it("should display project tasks after the project was created", async () => {
    renderProjects();
    expect(screen.queryByRole("heading", { level: 2 })).toBe(null);
    await addProjects(["Veresk"]);
    const heading = screen.getByRole("heading", { level: 2 });
    expect(heading.textContent).toBe("Veresk");
  });

  it("should save tasks inside the project", async () => {
    renderProjects();
    await addProjects(["Veresk", "Candy"]);
    await addTasks(["Candy task"]);

    await userEvent.click(getProjectTab("Veresk"));
    await addTasks(["Veresk task"]);

    await userEvent.click(getProjectTab("Candy"));
    expect(screen.queryByText("Candy task")).not.toBeNull();
    expect(screen.queryByText("Veresk task")).toBeNull();

    await userEvent.click(getProjectTab("Veresk"));
    expect(screen.queryByText("Candy task")).toBeNull();
    expect(screen.queryByText("Veresk task")).not.toBeNull();
  });

  it("should be able to complete task in one of the projects", async () => {
    renderProjects();
    await addProjects(["Veresk", "Candy"]);
    await addTasks(["Candy task"]);

    await userEvent.click(getProjectTab("Veresk"));
    await addTasks(["Veresk task"]);

    await userEvent.click(screen.getByText("Veresk task"));

    expect(hasClass(screen.getByText("Veresk task"), "line-through"));
  });

  it("should be able to delete task in one of the projects", async () => {
    renderProjects();
    await addProjects(["Veresk", "Candy"]);
    await addTasks(["Candy task"]);

    await userEvent.click(getProjectTab("Veresk"));
    await addTasks(["Veresk task"]);

    await userEvent.click(screen.getByText("Delete"));

    expect(screen.queryByText("Veresk task")).toBeNull();
  });

  it("should be able to delete the project", async () => {
    renderProjects();
    await addProjects(["Veresk"]);
    await userEvent.click(screen.getByText("Delete project"));
    expect(screen.queryAllByText("Veresk")).toHaveLength(0);
  });

  describe("init chat", () => {
    it("should init swarm topic as null in project", async () => {
      const persist = new PersistMock();
      renderProjects({ persist });
      await addProjects(["Veresk"]);
      const persistedProject = JSON.parse(await persist.get("projects"))[0];
      expect(persistedProject.topic).toBeNull();
    });

    it("should assign swarm topic to a project", async () => {
      const topic = "topic";
      const persist = new PersistMock();
      renderProjects({ persist, createTopic: () => topic });
      await addProjects(["Veresk"]);
      await userEvent.click(screen.getByText("Start Chat"));
      const persistedProject = JSON.parse(await persist.get("projects"))[0];
      expect(persistedProject.topic).toBe(topic);
    });

    it("should have 'Join project chat' button is project have savedTopic", async () => {
      const project = { ...createNewProject("Veresk"), topic: "topic" };
      const persist = new PersistMock({
        projects: JSON.stringify([project]),
      });
      renderProjects({ persist });

      await findProjectTab("Veresk");
      screen.getByText("Join project chat");
    });

    it("should show chat only for projects that connected to the swarm", async () => {
      const topic = "a".repeat(64);
      const projects = [
        { ...createNewProject("Veresk"), topic },
        createNewProject("Candy"),
      ];
      const persist = new PersistMock({
        projects: JSON.stringify(projects),
      });
      renderProjects({ persist });

      await findProjectTab("Veresk");
      await userEvent.click(screen.getByText("Join project chat"));
      screen.getByText(topic);

      userEvent.click(getProjectTab("Candy"));
      await screen.findByText("Start Chat");
    });
  });

  describe("persistance", () => {
    it("should init state from the persistence store", async () => {
      const project = createNewProject("Veresk");
      const persist = new PersistMock({
        projects: JSON.stringify([project]),
        tasks: JSON.stringify([
          createNewTask("task 1", project.id),
          createNewTask("task 2", project.id),
        ]),
      });
      renderProjects({ persist });

      expect(await findProjectTab("Veresk")).not.toBeNull();
      expect(await screen.findByText("task 1")).not.toBeNull();
      expect(await screen.findByText("task 2")).not.toBeNull();
    });

    it("should save state in the persistance state", async () => {
      const persist = new PersistMock();
      renderProjects({ persist });
      await addProjects(["Veresk"]);
      await addTasks(["task 1"]);

      expect(await persist.get("projects")).toBeTruthy();
      expect(await persist.get("tasks")).toBeTruthy();

      const persistedProjects = JSON.parse(await persist.get("projects"));
      expect(persistedProjects[0].name).toEqual("Veresk");
      const persistedTasks = JSON.parse(await persist.get("tasks"));
      expect(persistedTasks[0].text).toEqual("task 1");
    });

    it("should save projects in the persistance state after init", async () => {
      const persist = new PersistMock({
        projects: JSON.stringify([createNewProject("Veresk")]),
      });
      renderProjects({ persist });
      await addProjects(["Candy"]);
      const persistedProjects = JSON.parse(await persist.get("projects"));
      expect(persistedProjects[0].name).toEqual("Candy");
      expect(persistedProjects[1].name).toEqual("Veresk");
    });
  });

  describe("share", () => {
    it("should have share project button", async () => {
      renderProjects();
      await addProjects(["Veresk"]);
      screen.getByText("Share project");
    });
    it("should dispaly topic after clicking Share project button", async () => {
      const topic = "a".repeat(64);
      renderProjects({ createTopic: () => topic });
      await addProjects(["Veresk"]);
      await userEvent.click(screen.getByText("Share project"));
      await screen.findByText(topic);
    });
    it("should not show display button if project is already shared", async () => {
      const topic = "a".repeat(64);
      const persist = new PersistMock({
        projects: JSON.stringify([{ ...createNewProject("Veresk"), topic }]),
      });
      renderProjects({ persist });
      await expect(
        screen.findByText("Share project").catch(() => "not found")
      ).resolves.toBe("not found");
    });
    it("should show topic if project is already shared", async () => {
      const topic = "a".repeat(64);
      const project = { ...createNewProject("Veresk"), topic };
      const persist = new PersistMock({
        projects: JSON.stringify([project]),
      });
      renderProjects({ persist });
      await screen.findByText(topic);
    });
    it("should assign swarm topic to a project", async () => {
      const topic = "a".repeat(64);
      const persist = new PersistMock();
      renderProjects({ persist, createTopic: () => topic });
      await addProjects(["Veresk"]);
      await userEvent.click(screen.getByText("Share project"));
      const persistedProject = JSON.parse(await persist.get("projects"))[0];
      expect(persistedProject.topic).toBe(topic);
    });
  });

  describe("join", () => {
    it("should have join project button", async () => {
      renderProjects();
      await screen.findByText("Join project");
    });
    it("should show input after clicking", async () => {
      renderProjects();
      await userEvent.click(screen.getByText("Join project"));
      screen.getByLabelText("Topic");
    });
    it("should join swarm on submit", async () => {
      const swarm = new SwarmMock();
      renderProjects({ swarm });
      await userEvent.click(screen.getByText("Join project"));
      const topic = "a".repeat(64);
      await userEvent.keyboard(`${topic}{Enter}`);
      expect(swarm.join).toHaveBeenCalledWith(topic);
    });
    it("should close form after submit and clear the form", async () => {
      renderProjects();
      await userEvent.click(screen.getByText("Join project"));
      const topic = "a".repeat(64);

      await userEvent.type(screen.getByLabelText("Topic"), topic);
      await userEvent.click(screen.getByText("Join topic"));
      expect(screen.queryByText("Topic")).toBeNull();

      await userEvent.click(screen.getByText("Join project"));
      const input: HTMLInputElement = screen.getByLabelText("Topic");
      expect(input.value).toBe("");
    });
  });
  describe("send project", () => {
    it("should send project to a connected peer", async () => {
      const swarm = new SwarmMock();
      renderProjects({ swarm });
      await addProjects(["Veresk"]);
      await userEvent.click(screen.getByText("Share project"));
      const peer = { pubKey: "abc" };
      swarm.simulatePeerConnection(peer);
      expect(swarm.sendAll).toHaveBeenCalled();
    });
  });
});

function getProjectTab(name: string) {
  return within(screen.getByRole("tablist")).getByText(name);
}

function queryProjectTab(name: string) {
  return within(screen.getByRole("tablist")).queryByText(name);
}

function findProjectTab(name: string) {
  return within(screen.getByRole("tablist")).findByText(name);
}
