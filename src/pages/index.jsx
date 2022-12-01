import React, { useEffect, useState } from "react";
import { useDrop } from "react-dnd";
import DragArea from "../components/index/DragArea";
import ContentInfo from "../components/index/ContentInfo";

import { useDispatch, useSelector } from "react-redux";
import Output from "../components/index/Output";
import {
  setSelectedAlgos,
  setSelectedDatasets,
  setSelectedNormalizations,
} from "../redux/argumentSlice";
import { RiRouteLine } from "react-icons/ri";
import { AiFillDatabase } from "react-icons/ai";
import { TiWaves } from "react-icons/ti";
import { showNotification } from "@mantine/notifications";
const { ipcRenderer } = window.require("electron");

const IndexPage = () => {
  const dispatch = useDispatch();

  const [data, setData] = useState([]);

  useEffect(() => {
    ipcRenderer.on("log-from-main", (e, data) => {
      console.log(data);
    });
  }, []);
  const codeStatus = useSelector((state) => state.codeStatus);
  const selectedArguments = useSelector((state) => state.selectedArguments);

  const isValid = (obj, keys) => {
    let result = true;
    keys.map((key) => {
      if (obj[key].length === 0) {
        result = false;
      }
      return true;
    });
    return result;
  };

  useEffect(() => {
    if (
      codeStatus === "pressed-run" &&
      !isValid(selectedArguments, ["algorithms", "normalizations", "datasets"])
    )
      showNotification({
        message:
          "You need to select at least 1 algorithm, 1 dataset and 1 normalization technique. Forcing to add a normalization technique will be removed in the one of the next updates.",
        color: "red",
      });
  }, [codeStatus, selectedArguments]);

  return (
    <div className="index-page">
      <div className="drag-area--container">
        <DragArea
          onDrop={(data) => {
            dispatch(setSelectedAlgos(data));
          }}
          accept="algorithms"
          title={"Algoritmalar"}
          icon={<RiRouteLine />}
        />
        <DragArea
          onDrop={(data) => {
            dispatch(setSelectedDatasets(data));
          }}
          accept="datasets"
          title={"Datasetler"}
          icon={<AiFillDatabase />}
        />
        <DragArea
          onDrop={(data) => {
            dispatch(setSelectedNormalizations(data));
          }}
          accept="normalizations"
          title={"Normalizasyonlar"}
          icon={<TiWaves />}
        />
      </div>
    </div>
  );
};

export default IndexPage;
