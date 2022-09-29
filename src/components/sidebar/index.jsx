import { useState } from "react";
import { useEffect } from "react";
import Treeview from "./Treeview";

import "../../styles/sidebar.css";
import { useSelector } from "react-redux";
import Settings from "./Settings";
import ResizableArea from "../ResizableArea";

const Sidebar = () => {
  const menubar = useSelector((state) => state.menubar);

  return (
    <ResizableArea
      rotation={"right"}
      maxSize={500}
      minSize={200}
      defaultSize={300}
    >
      <div className="sidebar">
        <div className="sidebar-title">
          {menubar === "file-explorer" && "File Explorer"}
          {menubar === "settings" && "Settings"}
        </div>
        {menubar === "file-explorer" && <Treeview />}
        {menubar === "settings" && <Settings />}
      </div>
    </ResizableArea>
  );
};

export default Sidebar;
