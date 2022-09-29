import React from "react";
import Sidebar from "../sidebar";
import TopBar from "./Topbar";
import "../../styles/layout.css";
import Content from "./content";
import Appbar from "./Appbar";
import MenuBar from "../MenuBar/index.jsx";
import { useLocation } from "react-router-dom";
import Check from "../check";

const Layout = ({ children }) => {
  const router = useLocation();
  if (router.pathname === "/check") {
    return (
      <div className="app">
        <Check />
      </div>
    );
  }

  // const showSummary = useSelector((state) => state.showSummary);
  return (
    <div className="app">
      <Appbar />
      <TopBar />
      <div className="wrapper">
        <MenuBar />
        <Sidebar />
        <Content>{children}</Content>
      </div>
    </div>
  );
};

export default Layout;
