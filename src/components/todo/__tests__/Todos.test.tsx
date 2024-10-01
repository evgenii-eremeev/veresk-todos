import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Todos } from "../Todos";
import React from "react";

test("first todos test", async () => {
  render(<Todos />);

  await screen.findByText("todo");

});
