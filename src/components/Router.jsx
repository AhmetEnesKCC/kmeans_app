import React from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import IndexPage from "../pages";
import OutputPage from "../pages/output";
import Layout from "./Layout/index";

const Router = () => {
  return (
    <BrowserRouter>
      <Layout>
        <Routes>
          <Route path="/" element={<IndexPage />} exact />
          <Route path="/output" element={<OutputPage />} exact />
        </Routes>
      </Layout>
    </BrowserRouter>
  );
};

export default Router;
