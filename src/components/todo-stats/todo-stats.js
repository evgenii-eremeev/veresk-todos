import { html } from "uhtml/preactive";

export function TodoStats({ todosStats }) {
  return html`<p>
    Todos count: ${todosStats.count}
  </p>`;
}
