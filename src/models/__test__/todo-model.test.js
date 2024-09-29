
import { mockSignal } from "../../utils/testing";
import { createTodoModel } from "../todo-model";

describe("App Model", () => {
  it("should init todos with empty array", () => {
    const todos = mockSignal([]);
    const model = createTodoModel({ todos });
    expect(model.todos).toEqual([]);
  });

  it("should set todos", () => {
    const todos = mockSignal(["task 1"]);
    const modelBefore = createTodoModel({ todos });
    modelBefore.setTodos((prev) => [...prev, "task 2"]);
    const modelAfter = createTodoModel({ todos });
    expect(modelAfter.todos).toEqual(["task 1", "task 2"]);
  });

  it("should append todos", () => {
    const todos = mockSignal(["task 1"]);
    const modelBefore = createTodoModel({ todos });
    modelBefore.appendTodo("task 2");
    const modelAfter = createTodoModel({ todos });
    expect(modelAfter.todos).toEqual(["task 1", "task 2"]);
  });

  describe("stats", () => {
    it("should init stats count", () => {
      const todos = mockSignal([]);
      const model = createTodoModel({ todos });
      expect(model.todosStats.count).toBe(0);
    });
    it("should update stats count", () => {
      const todos = mockSignal(["task 1"]);
      const modelBefore = createTodoModel({ todos });
      expect(modelBefore.todosStats.count).toBe(1);
      modelBefore.setTodos(() => ['task 1', 'task 2'])
      const modelAfter = createTodoModel({ todos });
      expect(modelAfter.todosStats.count).toBe(2)
    });
  });
});
