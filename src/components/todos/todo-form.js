import { html, signal } from "uhtml/preactive";

const draft = signal("");

export class TodoForm {
  constructor(topModel, signals = { draft }) {
    this.topModel = topModel;
    this.signals = signals;
  }

  model() {
    const draft = this.signals.draft;
    return {
      onSubmit: (event) => {
        event.preventDefault();
        this.topModel.appendTodo(draft.value);
        draft.value = "";
      },
      onInput: (event) => (draft.value = event.target.value),
      inputValue: draft.value,
      buttonDisabled: !draft.value,
    };
  }
  render() {
    const { onSubmit, onInput, inputValue, buttonDisabled } = this.model();
    return html`<form onsubmit=${onSubmit}>
      <input value=${inputValue} oninput=${onInput} />
      <button type="submit" disabled=${buttonDisabled}>Add</button>
    </form>`;
  }

  static render(topModel) {
    return new TodoForm(topModel).render()
  }
}
