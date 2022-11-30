import { ActionIcon, Button } from "@mantine/core";
import { VscChromeMaximize } from "react-icons/vsc";

const { ipcRenderer } = window.require("electron");

const MaximizeButton = () => {
  const handleMaximize = () => {
    ipcRenderer.send("app-control:maximize");
  };

  return (
    <Button variant="subtle" onClick={handleMaximize}>
      <VscChromeMaximize />
    </Button>
  );
};

export default MaximizeButton;
