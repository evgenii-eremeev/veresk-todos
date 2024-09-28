import { signal } from "uhtml/preactive";
import { getAppModel } from "../model";

describe("App Model", () => {
  it("should init todos with empty array", () => {
    const todos = signal([]);
    const model = getAppModel({ todos });
    expect(model.todos).toEqual([]);
  });

  it("should set todos", () => {
    const todos = signal(["task 1"]);
    const modelBefore = getAppModel({ todos });
    modelBefore.setTodos((prev) => [...prev, "task 2"]);
    const modelAfter = getAppModel({ todos });
    expect(modelAfter.todos).toEqual(["task 1", "task 2"]);
  });

  it("should append todos", () => {
    const todos = signal(["task 1"]);
    const modelBefore = getAppModel({ todos });
    modelBefore.appendTodo("task 2");
    const modelAfter = getAppModel({ todos });
    expect(modelAfter.todos).toEqual(["task 1", "task 2"]);
  });

  describe("stats", () => {
    it("should init stats count", () => {
      const todos = signal([]);
      const model = getAppModel({ todos });
      expect(model.todosStats.count).toBe(0);
    });
    it("should update stats count", () => {
      const todos = signal(["task 1"]);
      const modelBefore = getAppModel({ todos });
      expect(modelBefore.todosStats.count).toBe(1);
      modelBefore.setTodos(() => ['task 1', 'task 2'])
      const modelAfter = getAppModel({ todos });
      expect(modelAfter.todosStats.count).toBe(2)
    });
  });
});
