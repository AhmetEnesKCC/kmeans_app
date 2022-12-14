import React, { useEffect } from "react";
import Sidebar from "./sidebar";
import TopBar from "./Topbar";
import Content from "./content";
import Appbar from "./Appbar";
import MenuBar from "../MenuBar/index.jsx";
import { useLocation, useNavigate } from "react-router-dom";
import Check from "../check";
import {
  ActionIcon,
  Box,
  Container,
  Group,
  LoadingOverlay,
  Paper,
  Stack,
  Text,
} from "@mantine/core";
import _ from "lodash";
import PageBox from "./PageBox";
import Loading from "./Loading";
import { FaArrowLeft, FaBackward } from "react-icons/fa";
import { useDispatch } from "react-redux";
import { setLoop } from "../../redux/argumentSlice";
const { ipcRenderer } = window.require("electron");

const Layout = ({ children }) => {
  const routePathName = useLocation()
    .pathname.replace("-", " ")
    .replace("/", "");
  const navigate = useNavigate();

  const dispatch = useDispatch();

  useEffect(() => {
    ipcRenderer.send("get-app-settings");
    ipcRenderer.on("settings-send", (e, settings) => {
      dispatch(setLoop(settings?.loop ?? 100));
    });
  }, []);

  // const showSummary = useSelector((state) => state.showSummary);
  return (
    <Paper>
      <Stack
        sx={{
          width: "100vw",
          height: "100vh",
          overflow: "hidden",
          position: "relative",
        }}
      >
        <Loading />
        <Appbar />
        <Group noWrap sx={{ flexGrow: 1, overflow: "hidden" }} align="start">
          <Sidebar />
          <Stack
            size={"lg"}
            sx={{ width: "100%", height: "100%", overflow: "hidden" }}
            p={10}
          >
            <Group>
              <ActionIcon
                onClick={() => {
                  navigate(-1);
                }}
              >
                {<FaArrowLeft />}
              </ActionIcon>
              <Text
                sx={(theme) => ({
                  color:
                    theme.colorScheme === "dark" ? "white" : theme.colors.dark,
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
            </Group>

            <Box sx={{ flex: 1, overflow: "hidden" }}>{children}</Box>
          </Stack>
        </Group>
      </Stack>
    </Paper>
  );
};

export default Layout;
