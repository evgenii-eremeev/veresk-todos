import { html } from "uhtml/preactive";
import { currentName, names } from "./state";

export const NamesForm = () => html`<form
  onsubmit=${(e) => {
    e.preventDefault();
    names.value = [...names.peek(), currentName.value];
    currentName.value = "";
  }}
>
  <input
    value=${currentName.value}
    oninput=${(e) => (currentName.value = e.target.value)}
  />
  <button type="submit" disabled=${!currentName.value}>Add</button>
</form>`;
