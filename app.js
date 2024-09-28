import { render, html } from "uhtml/preactive";
import { NamesForm } from "./src/names-form";
import { names } from "./src/state";


render(
  document.getElementById("root"),
  () => html`
    <div>
      ${NamesForm()}
      <ul>
        ${[...names.value.map((name) => html`<li>${name}</li>`)]}
      </ul>
    </div>
  `
);
