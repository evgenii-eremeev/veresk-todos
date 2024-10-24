import { act, render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import React from "react";
import {
  addProjects,
  addTasks,
  getProjectMock,
  getTaskMock,
  PersistMock,
  SwarmMock,
} from "../../../utils/testing";
import { Projects } from "../../projects/Projects";
import { createTopic } from "../../../backend/swarm";
import { Project } from "../../../types/project-types";
import { Swarm } from "../../../types/swarm-types";
import { Task } from "../../../types/task-types";

async function renderTasksAndSetup({
  swarm = new SwarmMock(),
}: { swarm?: Swarm } = {}) {
  render(
    <Projects
      persist={new PersistMock()}
      swarm={swarm}
      createTopic={createTopic}
    />
  );
  await addProjects(["Test project"]);
}

function addSharedProject(swarm: SwarmMock, project: Project, tasks: Task[]) {
  act(() => {
    swarm.simulatePeerData(
      { pubKey: "abcdef" },
      JSON.stringify({
        type: "share-project",
        payload: {
          project,
          tasks,
        },
      })
    );
  });
}

describe("Tasks", () => {
  it("should have a heading", async () => {
    await renderTasksAndSetup();

    const heading = screen.getByRole("heading", { level: 2 });
    expect(heading.textContent).toBe("Test project");
  });

  it("shuld render empty task list", async () => {
    await renderTasksAndSetup();
    const tasks = screen.getByRole("list");
    expect(tasks.children).toHaveLength(0);
  });

  it("should have an input and add tasks with input's content", async () => {
    await renderTasksAndSetup();

    const input: HTMLInputElement = screen.getByRole("textbox");
    await addTasks(["task 1"]);

    expect(await screen.findByText("task 1")).toBeTruthy();
    expect(input.value).toBe("");
  });

  it("should have a checkbox", async () => {
    await renderTasksAndSetup();

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
    await renderTasksAndSetup();
    const tasks = screen.getByRole("list");

    await userEvent.click(screen.getByText("Add"));
    expect(tasks.children).toHaveLength(0);
  });

  it("should be able to add many tasks", async () => {
    await renderTasksAndSetup();
    const tasks = screen.getByRole("list");
    await addTasks(["task 1", "task 2"]);

    expect(tasks.children).toHaveLength(2);
    expect(tasks.children[0].textContent).toContain("task 1");
    expect(tasks.children[1].textContent).toContain("task 2");
  });

  it("should add task on Enter", async () => {
    await renderTasksAndSetup();
    const tasks = screen.getByRole("list");

    screen.getByRole("textbox").focus();
    await userEvent.keyboard("task A{Enter}");

    expect(tasks.children).toHaveLength(1);
    expect(tasks.children[0].textContent).toContain("task A");
  });

  it("should focus on input by clicking the label", async () => {
    await renderTasksAndSetup();
    const tasks = screen.getByRole("list");

    await userEvent.click(screen.getByText("Create new"));
    await userEvent.keyboard("task{Enter}");

    expect(tasks.children).toHaveLength(1);
    expect(tasks.children[0].textContent).toContain("task");
  });

  it("should remove task on remove button click", async () => {
    await renderTasksAndSetup();
    const tasks = screen.getByRole("list");
    await addTasks(["task 1", "task 2"]);

    const [removeBtn1] = await screen.findAllByText("Delete");
    await userEvent.click(removeBtn1);

    expect(tasks.children).toHaveLength(1);
    expect(tasks.children[0].textContent).toContain("task 2");
  });

  describe("editing", () => {
    it("should show input with done button after clicking edit", async () => {
      await renderTasksAndSetup();
      const tasks = screen.getByRole("list");
      await addTasks(["task 1"]);

      await userEvent.click(screen.getByText("Edit"));
      expect(within(tasks).queryByLabelText("Edit task")).not.toBeNull();
      expect(within(tasks).queryByText("Done")).not.toBeNull();
    });

    it("should hide checkbox, text and delete button in edit mode", async () => {
      await renderTasksAndSetup();
      const tasks = screen.getByRole("list");
      await addTasks(["task 1"]);

      await userEvent.click(screen.getByText("Edit"));

      expect(within(tasks).queryByRole("checkbox")).toBeNull();
      expect(within(tasks).queryByText("task 1")).toBeNull();
      expect(within(tasks).queryByText("Edit")).toBeNull();
      expect(within(tasks).queryByText("Delete")).toBeNull();
    });

    it("should show task in read mode after clicking done", async () => {
      await renderTasksAndSetup();
      await addTasks(["task 1"]);
      const tasks = screen.getByRole("list");

      await userEvent.click(screen.getByText("Edit"));
      await userEvent.click(screen.getByText("Done"));

      expect(tasks.children.length).toBe(1);
      expect(within(tasks).queryByRole("checkbox")).not.toBeNull();
      expect(within(tasks).queryByText("task 1")).not.toBeNull();
      expect(within(tasks).queryByText("Edit")).not.toBeNull();
      expect(within(tasks).queryByText("Delete")).not.toBeNull();
    });

    it("should edit task text", async () => {
      await renderTasksAndSetup();
      await addTasks(["task 1"]);

      await userEvent.click(screen.getByText("Edit"));
      await userEvent.keyboard(" updated{Enter}");

      expect(screen.getByText("task 1 updated")).not.toBeNull();
    });
  });

  describe("editing shared task", () => {
    afterEach(() => {
      jest.restoreAllMocks();
    });

    it("should send edit event to the host", async () => {
      const swarm = new SwarmMock();
      await renderTasksAndSetup({ swarm });

      const project = getProjectMock("Alian", "projid", "topic");
      const tasks = [getTaskMock("alian task 1", "taskid", "projid")];
      addSharedProject(swarm, project, tasks);

      await userEvent.click(screen.getByText("Edit"));
      await userEvent.keyboard(" updated{Enter}");
      expect(swarm.sendAll).toHaveBeenCalledWith(
        JSON.stringify({
          type: "task-update",
          payload: getTaskMock("alian task 1 updated", "taskid", "projid"),
        })
      );
    });
    it("should receive edit event and update the task text", async () => {
      const swarm = new SwarmMock();
      await renderTasksAndSetup({ swarm });

      jest.spyOn(global.Math, "random").mockReturnValue(0.2);
      await addTasks(["task before"]);

      act(() => {
        swarm.simulatePeerData(
          { pubKey: "abcdef" },
          JSON.stringify({
            type: "task-update",
            payload: getTaskMock("task after", "2", "projid"),
          })
        );
      });

      expect(screen.queryByText("task before")).toBeNull();
      screen.getByText("task after");
    });
    it("should receive edit event and update the task completion state", async () => {
      const swarm = new SwarmMock();
      await renderTasksAndSetup({ swarm });

      jest.spyOn(global.Math, "random").mockReturnValue(0.2);
      await addTasks(["task 1"]);

      act(() => {
        swarm.simulatePeerData(
          { pubKey: "abcdef" },
          JSON.stringify({
            type: "task-update",
            payload: getTaskMock("task 1", "2", "projid", true),
          })
        );
      });

      expect(
        screen.getByText("task 1").classList.contains("line-through")
      ).toBe(true);
    });

    it("should send remove event", async () => {
      const swarm = new SwarmMock();
      await renderTasksAndSetup({ swarm });

      const project = getProjectMock("Alian", "projid", "topic");
      const tasks = [getTaskMock("alian task 1", "taskid", "projid")];
      addSharedProject(swarm, project, tasks);

      await userEvent.click(screen.getByText("Delete"));

      expect(swarm.sendAll).toHaveBeenCalledWith(
        JSON.stringify({
          type: "task-delete",
          payload: "taskid",
        })
      );
    });

    it("should receive edit event and update the task text", async () => {
      const swarm = new SwarmMock();
      await renderTasksAndSetup({ swarm });

      jest.spyOn(global.Math, "random").mockReturnValue(0.2);
      await addTasks(["task 1"]);

      act(() => {
        swarm.simulatePeerData(
          { pubKey: "abcdef" },
          JSON.stringify({
            type: "task-delete",
            payload: "2",
          })
        );
      });

      expect(screen.queryByText("task 1")).toBeNull();
    });

    it("should send add task event", async () => {
      const swarm = new SwarmMock();
      await renderTasksAndSetup({ swarm });

      const project = getProjectMock("Alian", "projid", "topic");
      const tasks = [getTaskMock("alian task 1", "taskid", "projid")];
      addSharedProject(swarm, project, tasks);

      jest.spyOn(global.Math, "random").mockReturnValue(0.2);
      await addTasks(['alian task 2']);

      expect(swarm.sendAll).toHaveBeenCalledWith(
        JSON.stringify({
          type: "task-add",
          payload: getTaskMock("alian task 2", "2", "projid"),
        })
      );
    });

    it("should receive add event and update the task list", async () => {
      const swarm = new SwarmMock();
      jest.spyOn(global.Math, "random").mockReturnValue(0.999);
      await renderTasksAndSetup({ swarm });

      jest.spyOn(global.Math, "random").mockReturnValue(0.1);
      await addTasks(["task 1"]);

      act(() => {
        swarm.simulatePeerData(
          { pubKey: "abcdef" },
          JSON.stringify({
            type: "task-add",
            payload: getTaskMock("alian task 2", "2", "999"),
          })
        );
      });

      await screen.findByText("alian task 2");
    });

  });
});
