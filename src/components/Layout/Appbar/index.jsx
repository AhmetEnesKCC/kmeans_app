import AppMenu from "./Menu";
import CloseButton from "./CloseButton";
import MaximizeButton from "./MaximizeButton";
import MinimizeButton from "./MinimizeButton";
import { openModal } from "@mantine/modals";
import Check from "../../check";
import About from "../../about";
import Notes from "../../notes";
import { Box, Button, Group, Switch, Text } from "@mantine/core";
import PageBox from "../PageBox";
import { setTheme } from "../../../redux/uiSlice";
import { BsMoon, BsSun } from "react-icons/bs";
import { useDispatch, useSelector } from "react-redux";

const { ipcRenderer } = window.require("electron");

const Appbar = () => {
  const theme = useSelector((state) => state.ui.theme);

  const dispatch = useDispatch();

  const appMenuDropdown = [
    {
      label: "Test Dependencies",
      click: () => {
        ipcRenderer.send("menu:test");
        openModal({
          title: "Testing Dependencies",
          children: <Check />,
          onClose: () => {
            ipcRenderer.send("check:abort");
          },
        });
      },
    },
    {
      label: "About App",
      click: () => {
        ipcRenderer.send("menu:about");
        openModal({
          title: "About App",
          children: <About />,
        });
      },
    },
    {
      label: "Version Notes",
      click: () => {
        ipcRenderer.send("menu:version");
        openModal({
          title: "Version Notes",
          children: <Notes />,
          overflow: "inside",
        });
      },
    },
    { type: "divider" },
    {
      label: "Open in GITHUB",
      click: () => {
        ipcRenderer.send("menu:github");
      },
    },
  ];

  return (
    <Box
      component={PageBox}
      style={{
        "-webkit-app-region": "drag",
      }}
    >
      <Group position="apart" p={3}>
        <Group>
          <AppMenu target="Help" dropdown={appMenuDropdown} />
          <Box>
            <Text>Kmeans GUI</Text>
          </Box>
          <Group noWrap>
            <Text>Tema: {theme === "dark" ? "Koyu" : "Açık"}</Text>
            <Switch
              style={{
                "-webkit-app-region": "no-drag",
              }}
              onChange={(e) => {
                dispatch(setTheme(theme === "dark" ? "light" : "dark"));
              }}
              checked={theme === "dark"}
              size="md"
              color={theme === "dark" ? "gray" : "dark"}
              onLabel={<BsSun size={16} stroke={2.5} color={"yellow.4"} />}
              offLabel={<BsMoon size={16} stroke={2.5} color={"blue.6"} />}
            />
          </Group>
        </Group>
        <Button.Group>
          <MinimizeButton />
          <MaximizeButton />
          <CloseButton />
        </Button.Group>
      </Group>
    </Box>
  );
};

export default Appbar;
