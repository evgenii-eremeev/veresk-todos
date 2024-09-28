import { html } from "uhtml/preactive";

export function TodoList({ todos }) {
  return html`<ol>
    ${[...todos.map((name) => html`<li>${name}</li>`)]}
  </ol>`;
}
