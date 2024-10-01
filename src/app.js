import { html } from "uhtml/preactive";
import { TodoList } from "./components/todos/todo-list";
import { TodoForm } from "./components/todos/todo-form";

export const createApp = (models) => {
  const { todoModel } = models;

  return html`
    <!-- prettier-ignore -->
    ${TodoForm(todoModel)}
    ${TodoList(todoModel)}
  `;
};
