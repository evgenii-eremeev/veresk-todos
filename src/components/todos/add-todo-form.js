import { html, signal } from "uhtml/preactive";

export function AddTodoForm(props, signals = { draftTodo }) {
  const model = createAddTodoFormModel(props, signals);

  return html`<form onsubmit=${model.onSubmit}>
    <input
      value=${model.inputValue}
      oninput=${model.onInput}
    />
    <button type="submit" disabled=${model.buttonDisabled}>Add</button>
  </form>`;
}

export function createAddTodoFormModel(props, signals = { draftTodo }) {
  const { appendTodo } = props;
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