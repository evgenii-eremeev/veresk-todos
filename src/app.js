import { html } from "uhtml/preactive";
import { AddTodoForm } from "./components/todos/add-todo-form";
import { TodoList } from "./components/todos/todo-list";
import { TodoStats } from "./components/todo-stats/todo-stats";

export const createApp = (models) => {
  const { todoModel } = models;

  return html`
    <!-- prettier-ignore -->
    ${AddTodoForm(todoModel)}
    ${TodoList(todoModel)}
    ${TodoStats(todoModel)}
  `;
};
