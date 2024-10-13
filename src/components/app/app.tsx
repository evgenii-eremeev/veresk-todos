import React from "react";
import { Projects } from "../projects/Projects";
import { Persist } from "../../utils/persist";

const persist = new Persist();

export function App() {
  return (
    <>
      <Projects persist={persist} />
    </>
  );
}
