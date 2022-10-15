import AppMenu from "./Menu";
import CloseButton from "./CloseButton";
import MaximizeButton from "./MaximizeButton";
import MinimizeButton from "./MinimizeButton";
import { openModal } from "@mantine/modals";
import Check from "../../check";
import About from "../../about";
import Notes from "../../notes";

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
    <div className="appbar">
      <div className="app-menus">
        <AppMenu target="Help" dropdown={appMenuDropdown} />
      </div>
      <div className="app-controls">
        <MinimizeButton />
        <MaximizeButton />
        <CloseButton />
      </div>
    </div>
  );
};

export default Appbar;
