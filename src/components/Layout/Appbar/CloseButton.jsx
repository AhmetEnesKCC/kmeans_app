import { AiOutlineClose } from "react-icons/ai";

const { ipcRenderer } = window.require("electron");

const CloseButton = () => {
  const handleClose = () => {
    ipcRenderer.send("app-control:close");
  };

  return (
    <button onClick={handleClose} className="app-control--close">
      <AiOutlineClose />
    </button>
  );
};

export default CloseButton;
