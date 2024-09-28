import { html, signal } from "uhtml/preactive";

export function AddTodoForm(topModel, signals = { draftTodo }) {
  const model = createAddTodoFormModel(topModel, signals);

  return html`<form onsubmit=${model.onSubmit}>
    <input
      value=${model.inputValue}
      oninput=${model.onInput}
    />
    <button type="submit" disabled=${model.buttonDisabled}>Add</button>
  </form>`;
}

export function createAddTodoFormModel(topModel, signals = { draftTodo }) {
  const { appendTodo } = topModel;
  const { draftTodo } = signals;

  return {
    onSubmit: (event) => {
      event.preventDefault();
      addTodo();
    },
    onInput: (event) => (draftTodo.value = event.target.value),
    buttonDisabled: !draftTodo.value,
    inputValue: draftTodo.value
  };

  function addTodo() {
    appendTodo(draftTodo.peek());
    draftTodo.value = "";
  }
}

const draftTodo = signal("");