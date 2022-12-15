import React from "react";
import { HashRouter, Route, Routes } from "react-router-dom";
import IndexPage from "../pages";
import OutputPage from "../pages/output";
import FlowBuilderPage from "../pages/flowBuilder";
import Layout from "./Layout/index";
import {
  DEFAULT_THEME,
  MantineProvider,
  TypographyStylesProvider,
} from "@mantine/core";
import {
  NotificationsProvider,
  useNotifications,
} from "@mantine/notifications";
import { ModalsProvider } from "@mantine/modals";
import { useSelector } from "react-redux";
import { ReactFlowProvider } from "reactflow";
import Settings from "../pages/settings";
import Output from "./index/Output";

const Router = () => {
  const theme = useSelector((state) => state.ui.theme);

  return (
    <HashRouter>
      <ReactFlowProvider>
        <MantineProvider
          theme={{
            colorScheme: theme,
            components: {
              Text: {
                styles: (theme) => ({
                  root: {
                    color:
                      theme.colorScheme === "dark"
                        ? "white"
                        : theme.colors.gray,
                  },
                }),
              },
              Button: {
                styles: {
                  root: {
                    '&:not([type="submit"])': {
                      width: "max-content",
                    },
                  },
                },
              },
            },
          }}
        >
          <NotificationsProvider limit={1}>
            <ModalsProvider>
              <Layout>
                <Routes>
                  <Route path="/" element={<IndexPage />} exact />
                  <Route
                    path="/flow-builder"
                    element={<FlowBuilderPage />}
                    exact
                  />
                  <Route path="/output" element={<Output />} exact />
                  <Route path="/settings" element={<Settings />} exact />
                </Routes>
              </Layout>
            </ModalsProvider>
          </NotificationsProvider>
        </MantineProvider>
      </ReactFlowProvider>
    </HashRouter>
  );
};

export default Router;
