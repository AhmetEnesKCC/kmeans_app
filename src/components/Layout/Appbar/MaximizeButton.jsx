import { VscChromeMaximize } from "react-icons/vsc";

const { ipcRenderer } = window.require("electron");

const MaximizeButton = () => {
  const handleMaximize = () => {
    ipcRenderer.send("app-control:maximize");
  };

  return (
    <button onClick={handleMaximize}>
      <VscChromeMaximize />
    </button>
  );
};

export default MaximizeButton;
