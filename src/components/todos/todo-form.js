import { html, signal } from "uhtml/preactive";

const draft = signal("");

export function TodoForm(topModel, signals = { draft }) {
  const { onSubmit, onInput, inputValue, buttonDisabled } = TodoForm.model(
    topModel,
    signals
  );
  return html`<form onsubmit=${onSubmit}>
    <input value=${inputValue} oninput=${onInput} />
    <button type="submit" disabled=${buttonDisabled}>Add</button>
  </form>`;
}

TodoForm.model = (topModel, { draft }) => {
  return {
    onSubmit: (event) => {
      event.preventDefault();
      topModel.appendTodo(draft.value);
      draft.value = "";
    },
    onInput: (event) => (draft.value = event.target.value),
    inputValue: draft.value,
    buttonDisabled: !draft.value,
  };
};
