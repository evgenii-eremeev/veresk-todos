import { html } from "uhtml/preactive";
import { AddTodoForm } from "./components/todos/add-todo-form";
import { TodoList } from "./components/todos/todo-list";
import { TodoStats } from "./components/todo-stats/todo-stats";

export const createApp = (model) => {
  const { todos, setTodos, todosStats } = model;

  return html`
    <!-- prettier-ignore -->
    ${AddTodoForm({ setTodos })}
    ${TodoList({ todos })}
    ${TodoStats({ todosStats })}
  `;
};
