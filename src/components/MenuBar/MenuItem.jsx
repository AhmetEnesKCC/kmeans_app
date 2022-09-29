import React from "react";
import { BsFiles } from "react-icons/bs";
import { FiSettings } from "react-icons/fi";
import { useSelector } from "react-redux";

const MenuItem = ({ children, compare }) => {
  const menubar = useSelector((state) => state.menubar);

  return (
    <div className={`menu-bar--item ${compare === menubar ? "selected" : ""}`}>
      {children}
    </div>
  );
};

export const FilesMenuItem = ({ selected }) => {
  return (
    <MenuItem compare="file-explorer">
      <BsFiles />
    </MenuItem>
  );
};

export const SettingsMenuItem = ({ selected }) => {
  return (
    <MenuItem compare="settings">
      <FiSettings />
    </MenuItem>
  );
};
