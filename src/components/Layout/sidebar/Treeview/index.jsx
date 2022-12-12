import { Box, FileInput, Stack } from "@mantine/core";
import { useEffect, useState } from "react";
import File from "./File";
import Folder from "./Folder";
const { ipcRenderer } = window.require("electron");

const Treeview = () => {
  useEffect(() => {
    ipcRenderer.send("treeview-loaded");
  }, []);

  const [data, setData] = useState([]);

  const handleData = (data) => {
    const handleIteration = (iterationData, deep = 0) => {
      deep += 1;
      if (iterationData.iteratable) {
        return (
          <>
            <Folder
              data={iterationData}
              deep={deep}
              label={iterationData.label}
            >
              {iterationData?.content.map((id) => {
                return handleIteration(id, deep);
              })}
            </Folder>
          </>
        );
      } else {
        return (
          <File data={iterationData} ext={iterationData.ext}>
            {iterationData.label}
          </File>
        );
      }
    };
    return data.map((d) => {
      if (d.status === "success") {
        return handleIteration(d);
      } else {
        return <div>Error</div>;
      }
    });
  };

  useEffect(() => {
    // ipcRenderer.on("get-data", (e, data) => {
    //   setData(data);
    // });
  }, []);

  return <div className="treeview">{handleData(data)}</div>;
};

export default Treeview;
