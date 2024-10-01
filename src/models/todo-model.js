import { signal } from "uhtml/preactive";
import { signalSetter } from "../utils/signal";

const todos = signal([]);

export function getTodoModel(signals = { todos }) {
  const { todos } = signals;
  const setTodos = signalSetter(signals.todos);

  return {
    todos: todos.value,
    setTodos,
    appendTodo: (newTodo) => setTodos((prev) => [...prev, newTodo]),
    removeTodo: (index) =>
      setTodos((prev) => prev.filter((_, i) => index !== i)),
    todosStats: {
      count: todos.value.length,
    },
    signals
  };
}
