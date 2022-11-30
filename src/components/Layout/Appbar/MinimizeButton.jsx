import { Button } from "@mantine/core";
import { VscChromeMinimize } from "react-icons/vsc";

const { ipcRenderer } = window.require("electron");

const MinimizeButton = () => {
  const handleMinimize = () => {
    ipcRenderer.send("app-control:minimize");
  };

  return (
    <Button variant="subtle" onClick={handleMinimize}>
      <VscChromeMinimize />
    </Button>
  );
};

export default MinimizeButton;
