import { html } from "uhtml/preactive";

export function TodoStats({ todosStats }) {
  return html`<p class="text-cyan-800">
    Todos count: ${todosStats.count}
  </p>`;
}
