import { useDispatch, useSelector } from "react-redux";
import { setMenubar } from "../../redux/menubarSlice";
import "../../styles/menubar.css";
import { FilesMenuItem, SettingsMenuItem } from "./MenuItem";

const MenuBar = () => {
  const dispatch = useDispatch();

  const dispatchMenubar = (payload) => {
    dispatch(setMenubar(payload));
  };

  return (
    <div className="menu-bar">
      <div
        onClick={() => {
          dispatchMenubar("file-explorer");
        }}
      >
        <FilesMenuItem />
      </div>
      <div
        onClick={() => {
          dispatchMenubar("settings");
        }}
      >
        <SettingsMenuItem />
      </div>
    </div>
  );
};

export default MenuBar;
