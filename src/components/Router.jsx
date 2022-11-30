import React from "react";
import { HashRouter, Route, Routes } from "react-router-dom";
import IndexPage from "../pages";
import OutputPage from "../pages/output";
import FlowBuilderPage from "../pages/flowBuilder";
import Layout from "./Layout/index";
import { MantineProvider } from "@mantine/core";
import { NotificationsProvider } from "@mantine/notifications";
import { ModalsProvider } from "@mantine/modals";
import { useSelector } from "react-redux";
import { ReactFlowProvider } from "reactflow";
import Settings from "./sidebar/Settings";

const Router = () => {
  const theme = useSelector((state) => state.ui.theme);

  return (
    <HashRouter>
      <Layout>
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
            <NotificationsProvider>
              <ModalsProvider>
                <Routes>
                  <Route path="/" element={<IndexPage />} exact />
                  <Route
                    path="/flow-builder"
                    element={<FlowBuilderPage />}
                    exact
                  />
                  <Route path="/settings" element={<Settings />} exact />
                </Routes>
              </ModalsProvider>
            </NotificationsProvider>
          </MantineProvider>
        </ReactFlowProvider>
      </Layout>
    </HashRouter>
  );
};

export default Router;
