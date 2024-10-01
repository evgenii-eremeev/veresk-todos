import { html } from "uhtml/preactive";

export function TodoList(topModel: any) {
  const { todos } = topModel;
  const { onItemClick } = TodoList.model(topModel);
  return html`<ol>
    ${[
      ...todos.map(
        (name: string, index: number) =>
          html`<li
            class="border-solid border-2 border-blue-500"
            onclick=${() => onItemClick(index)}
          >
            ${name}
          </li>`
      ),
    ]}
  </ol>`;
}

TodoList.model = (topModel: any) => {
  return {
    onItemClick: topModel.removeTodo,
  };
};
