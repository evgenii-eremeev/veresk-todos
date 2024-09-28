import { render } from "uhtml/preactive";
import { getAppModel } from "./model/model";
import { createApp } from "./app";

const root = document.getElementById("root");

render(root, () => createApp(getAppModel()));
