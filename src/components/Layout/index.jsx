import React from "react";
import Sidebar from "../sidebar";
import TopBar from "./Topbar";
import Content from "./content";
import Appbar from "./Appbar";
import MenuBar from "../MenuBar/index.jsx";
import { useLocation } from "react-router-dom";
import Check from "../check";
import { Box, Container, Group, Stack, Text } from "@mantine/core";
import _ from "lodash";
import PageBox from "./PageBox";

const Layout = ({ children }) => {
  const routePathName = useLocation()
    .pathname.replace("-", " ")
    .replace("/", "");
  // const showSummary = useSelector((state) => state.showSummary);
  return (
    <Stack
      sx={{
        width: "100vw",
        height: "100vh",
        overflow: "hidden",
      }}
    >
      <Appbar />
      <Group noWrap sx={{ flexGrow: 1, overflow: "hidden" }} align="start">
        <Sidebar />
        <Stack
          size={"lg"}
          sx={{ width: "100%", height: "100%", overflow: "hidden" }}
          p={10}
        >
          <Text
            sx={(theme) => ({
              color: theme.colorScheme === "dark" ? "white" : theme.colors.dark,
              opacity: 0.7,
              width: "max-content",
              borderRadius: theme.radius.md,
            })}
            component={PageBox}
            px={10}
            size={18}
            weight="bold"
          >
            {_.capitalize(routePathName === "" ? "home" : routePathName)}
          </Text>
          <Box sx={{ flex: 1, overflow: "hidden" }}>{children}</Box>
        </Stack>
      </Group>
    </Stack>
  );
};

export default Layout;
