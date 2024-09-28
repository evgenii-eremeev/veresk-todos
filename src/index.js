import { render } from "uhtml/preactive";
import { createApp } from "./app";
import { getAllModels } from "./models/all-models";

const root = document.getElementById("root");

render(root, () => createApp(getAllModels()));
