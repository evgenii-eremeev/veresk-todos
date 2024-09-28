import { html } from "uhtml/preactive";
import { AddTodoForm } from "./components/todos/add-todo-form";
import { TodoList } from "./components/todos/todo-list";
import { TodoStats } from "./components/todo-stats/todo-stats";

export const createApp = (model) => {
  const { todos, appendTodo, todosStats } = model;

  return html`
    <!-- prettier-ignore -->
    ${AddTodoForm({ appendTodo })}
    ${TodoList({ todos })}
    ${TodoStats({ todosStats })}
  `;
};
