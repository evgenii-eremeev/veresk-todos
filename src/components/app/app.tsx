import React, { useEffect, useState } from "react";

import { Signal } from "uhtml/preactive";
import { TodoStats } from "../todo-stats/todo-stats";

interface Props {
  models: {
    todoModel: {
      signals: {
        todos: Signal<Array<string>>;
      }
      todos: Array<string>;
      todosStats: {
        count: number;
      };
    };
  };
}

export function App({ models: { todoModel } }: Props) {
  const [statsCount, setStatsCount] = React.useState<number>(0);
  React.useEffect(() => {
    todoModel.signals.todos.subscribe(todos => {
      setStatsCount(todos.length)
    })
  }, [])
  return (
    <div>
      <TodoStats statsCount={statsCount} />
    </div>
  );
}
