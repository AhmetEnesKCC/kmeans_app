import { VscChromeMinimize } from "react-icons/vsc";

const { ipcRenderer } = window.require("electron");

const MinimizeButton = () => {
  const handleMinimize = () => {
    ipcRenderer.send("app-control:minimize");
  };

  return (
    <button onClick={handleMinimize}>
      <VscChromeMinimize />
    </button>
  );
};

export default MinimizeButton;
