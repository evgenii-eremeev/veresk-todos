import { render } from "uhtml/preactive";
import { createApp } from "./app";
import { getAllModels } from "./models/all-models";
import { createRoot } from "react-dom/client";
import React from "react";
import { App } from "./components/app/app";

// uhtml
const root = document.getElementById("root");
render(root, () => createApp(getAllModels()));

// react
const root2 = createRoot(document.getElementById("root2"));
root2.render(<App models={getAllModels()} />);
