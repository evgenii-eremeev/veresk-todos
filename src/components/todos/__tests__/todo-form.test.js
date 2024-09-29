import { TodoForm } from "../todo-form";
import { getTodoModel } from "../../../models/todo-model";
import { mockEvent, mockSignal } from "../../../utils/testing";

describe("Todo Form", () => {
  it("should have static render method", () => {
    expect(TodoForm.render({})).toBeTruthy();
  });

  describe("model.onSubmit", () => {
    it("should prevent default event behaviour", () => {
      const { form } = initTodoForm();

      const event = mockEvent();
      expect(form.model().onSubmit(event)).not.toBeTruthy();
      expect(event.preventDefault).toHaveBeenCalled();
    });

    it("should reset input value on submit", () => {
      const { form } = initTodoForm();
      form.model().onSubmit(mockEvent());
      expect(form.model().inputValue).toBe("");
    });

    it("should append draft value to todos", () => {
      const { form, todos } = initTodoForm();
      form.model().onInput(mockEvent("todo"));
      form.model().onSubmit(mockEvent());
      expect(todos.value).toEqual(["todo"]);
    });
  });

  describe("model.inputValue and model.onInput", () => {
    it("should change after on input call", () => {
      const { form } = initTodoForm();

      expect(form.model().inputValue).toBe("");
      form.model().onInput(mockEvent("todo 1"));
      expect(form.model().inputValue).toBe("todo 1");
    });
  });

  describe("model.buttonDisabled", () => {
    it("should be true if input is empty", () => {
      const { form } = initTodoForm();
      form.model().onInput(mockEvent(""));
      expect(form.model().buttonDisabled).toBe(true);
    });
    it("should be false if input is not empty", () => {
      const { form } = initTodoForm();
      form.model().onInput(mockEvent("todo"));
      expect(form.model().buttonDisabled).toBe(false);
    });
  });
});

function initTodoForm() {
  const draft = mockSignal("");
  const todos = mockSignal([]);
  const todoModel = getTodoModel({ todos });
  const form = new TodoForm(todoModel, { draft });
  const model = form.model();
  return { form, model, todos };
}
