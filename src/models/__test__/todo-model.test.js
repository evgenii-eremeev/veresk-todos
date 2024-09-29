import { mockSignal } from "../../utils/testing";
import { getTodoModel } from "../todo-model";

describe("App Model", () => {
  it("should init todos with empty array", () => {
    const todos = mockSignal([]);
    const model = getTodoModel({ todos });
    expect(model.todos).toEqual([]);
  });

  it("should set todos", () => {
    const todos = mockSignal(["task 1"]);
    const modelBefore = getTodoModel({ todos });
    modelBefore.setTodos((prev) => [...prev, "task 2"]);
    const modelAfter = getTodoModel({ todos });
    expect(modelAfter.todos).toEqual(["task 1", "task 2"]);
  });

  it("should append todos", () => {
    const todos = mockSignal(["task 1"]);
    getTodoModel({ todos }).appendTodo("task 2");
    const model = getTodoModel({ todos });
    expect(model.todos).toEqual(["task 1", "task 2"]);
  });

  it("should remove a todo", () => {
    const todos = mockSignal(["task 1", "task 2", "task 3"]);
    getTodoModel({ todos }).removeTodo(0);
    expect(getTodoModel({ todos }).todos).toEqual(["task 2", "task 3"]);
  });

  it("should remove all todos", () => {
    const todos = mockSignal(["task 1", "task 2", "task 3"]);
    const model = getTodoModel({ todos });
    model.removeTodo(0);
    model.removeTodo(0);
    model.removeTodo(0);
    expect(getTodoModel({ todos }).todos).toEqual([]);
  });

  describe("stats", () => {
    it("should init stats count", () => {
      const todos = mockSignal([]);
      const model = getTodoModel({ todos });
      expect(model.todosStats.count).toBe(0);
    });
    it("should update stats count", () => {
      const todos = mockSignal(["task 1"]);
      const modelBefore = getTodoModel({ todos });
      expect(modelBefore.todosStats.count).toBe(1);
      modelBefore.setTodos(() => ["task 1", "task 2"]);
      const modelAfter = getTodoModel({ todos });
      expect(modelAfter.todosStats.count).toBe(2);
    });
  });
});
