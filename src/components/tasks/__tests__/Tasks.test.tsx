import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Tasks } from "../Tasks";
import React from "react";

test("first todos test", async () => {
  render(<Tasks />);

  await screen.findByText("tasks");

});
