import { createTodoModel } from "./todo-model";

export function getAllModels() {
    return {
      todoModel: createTodoModel()
    };
  }
  