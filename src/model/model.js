import { signal } from "uhtml/preactive";
import { signalSetter } from "../utils/signal";

const todos = signal([]);

export function getAppModel(signals = { todos }) {
  const { todos } = signals;

  return {
    todos: todos.value,
    setTodos: signalSetter(signals.todos),
    todosStats: {
      count: todos.value.length
    }
  };
}
