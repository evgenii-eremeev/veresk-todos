import { TodoList } from "../todo-list";
import { mockSignal } from "../../../utils/testing";
import { getTodoModel } from "../../../models/todo-model";

describe("todo list", () => {
  it("should have no effect on empty todo list", () => {
    const { model, todos } = initTodoListModel([]);
    model().onItemClick(0);
    expect(todos.value).toEqual([]);
  });
  it("should remove first element", () => {
    const { model, todos } = initTodoListModel(["todo 1"]);
    model().onItemClick(0);
    expect(todos.value).toEqual([]);
  });
  it("should remove midle element", () => {
    const { model, todos } = initTodoListModel(["todo 1", "todo 2", "todo 3"]);
    model().onItemClick(1);
    expect(todos.value).toEqual(["todo 1", "todo 3"]);
  });

});

function initTodoListModel(todoItems) {
  const todos = mockSignal(todoItems);
  const todoModel = getTodoModel({ todos });
  const model = () => TodoList.model(todoModel);;
  return { model, todos };
}
