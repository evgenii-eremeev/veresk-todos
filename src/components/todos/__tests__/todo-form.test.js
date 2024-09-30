import { TodoForm } from "../todo-form";
import { getTodoModel } from "../../../models/todo-model";
import { mockEvent, mockSignal } from "../../../utils/testing";

describe("Todo Form", () => {
  it("should have static render method", () => {
    expect(TodoForm({})).toBeTruthy();
  });

  describe("model.onSubmit", () => {
    it("should prevent default event behaviour", () => {
      const { model } = initTodoForm();

      const event = mockEvent();
      expect(model().onSubmit(event)).not.toBeTruthy();
      expect(event.preventDefault).toHaveBeenCalled();
    });

    it("should reset input value on submit", () => {
      const { model } = initTodoForm();
      model().onSubmit(mockEvent());
      expect(model().inputValue).toBe("");
    });

    it("should append draft value to todos", () => {
      const { model, todos } = initTodoForm();
      model().onInput(mockEvent("todo"));
      model().onSubmit(mockEvent());
      expect(todos.value).toEqual(["todo"]);
    });
  });

  describe("model.inputValue and model.onInput", () => {
    it("should change after on input call", () => {
      const { model } = initTodoForm();

      expect(model().inputValue).toBe("");
      model().onInput(mockEvent("todo 1"));
      expect(model().inputValue).toBe("todo 1");
    });
  });

  describe("model.buttonDisabled", () => {
    it("should be true if input is empty", () => {
      const { model } = initTodoForm();
      model().onInput(mockEvent(""));
      expect(model().buttonDisabled).toBe(true);
    });
    it("should be false if input is not empty", () => {
      const { model } = initTodoForm();
      model().onInput(mockEvent("todo"));
      expect(model().buttonDisabled).toBe(false);
    });
  });
});

function initTodoForm() {
  const draft = mockSignal("");
  const todos = mockSignal([]);
  const todoModel = getTodoModel({ todos });

  const model = () => TodoForm.model(todoModel, { draft });
  return { model, todos };
}
