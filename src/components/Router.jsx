import React from "react";
import { HashRouter, Route, Routes } from "react-router-dom";
import IndexPage from "../pages";
import OutputPage from "../pages/output";
import Layout from "./Layout/index";

const Router = () => {
  return (
    <HashRouter>
      <Layout>
        <Routes>
          <Route path="/" element={<IndexPage />} exact />
          <Route path="/output" element={<OutputPage />} exact />
        </Routes>
      </Layout>
    </HashRouter>
  );
};

export default Router;
