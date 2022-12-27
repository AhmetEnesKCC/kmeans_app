import { MantineProvider } from "@mantine/core";
import { ModalsProvider } from "@mantine/modals";
import { NotificationsProvider } from "@mantine/notifications";
import React from "react";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import ReactDOM from "react-dom/client";
import { Provider } from "react-redux";
import Router from "./components/Router";
import Store from "./redux/store";
import "./i18n";

import "./styles/global.css";
import "reactflow/dist/style.css";

const root = ReactDOM.createRoot(document.getElementById("root"));

root.render(
  <Provider store={Store}>
    <DndProvider backend={HTML5Backend}>
      <Router />
    </DndProvider>
  </Provider>
);
