import { signal } from "uhtml/preactive";
import { signalSetter } from "../utils/signal";

const todos = signal([]);

export function createTodoModel(signals = { todos }) {
  const { todos } = signals;
  const setTodos = signalSetter(signals.todos);

  return {
    todos: todos.value,
    setTodos,
    appendTodo: (newTodo) => setTodos(prev => [...prev, newTodo]),
    todosStats: {
      count: todos.value.length
    }
  };
}
