import { ActionIcon, Button, UnstyledButton } from "@mantine/core";
import { AiOutlineClose } from "react-icons/ai";

const { ipcRenderer } = window.require("electron");

const CloseButton = () => {
  const handleClose = () => {
    ipcRenderer.send("app-control:close");
  };

  return (
    <Button
      variant="subtle"
      color="red.5"
      onClick={handleClose}
      className="app-control--close text-white"
    >
      <AiOutlineClose />
    </Button>
  );
};

export default CloseButton;
