import AppMenu from "./Menu";
import CloseButton from "./CloseButton";
import MaximizeButton from "./MaximizeButton";
import MinimizeButton from "./MinimizeButton";
import { openModal } from "@mantine/modals";
import Check from "../../check";
import About from "../../about";
import Notes from "../../notes";
import { Box, Button, Group, Text } from "@mantine/core";
import PageBox from "../PageBox";

const { ipcRenderer } = window.require("electron");

const Appbar = () => {
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
    <Box component={PageBox}>
      <Group position="apart" p={3}>
        <Group>
          <AppMenu target="Help" dropdown={appMenuDropdown} />
          <Box>
            <Text>Kmeans GUI</Text>
          </Box>
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
