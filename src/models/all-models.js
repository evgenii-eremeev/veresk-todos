import { getTodoModel } from "./todo-model";

export function getAllModels() {
    return {
      todoModel: getTodoModel()
    };
  }
  