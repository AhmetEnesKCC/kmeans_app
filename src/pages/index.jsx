import React, { useEffect, useState } from "react";
import { useDrop } from "react-dnd";
import DragArea from "../components/index/DragArea";
import ContentInfo from "../components/index/ContentInfo";

import "../styles/index.css";
import { useDispatch, useSelector } from "react-redux";
import Output from "../components/index/Output";
import {
  setSelectedAlgos,
  setSelectedDatasets,
  setSelectedNormalizations,
} from "../redux/argumentSlice";
const { ipcRenderer } = window.require("electron");

// import { useSelector, useDispatch } from "react-redux";
// import {
//   setLoop,
//   setSelectedAlgos,
//   setSelectedDatasets,
//   setSelectedNormalizations,
// } from "../redux/argumentSlice";
// import CategoryTab from "../components/index/CategoryTab";
// import TabWrapper from "../components/index/TabWrapper";

// const IndexPage = () => {
//   const {
//     algorithms: selectedAlgorithms,
//     datasets: selectedDatasets,
//     normalizations: selectedNormalizations,
//     loop,
//   } = useSelector((state) => state.selectedArguments);

//   const [algorithms, setalgorithms] = useState([]);
//   const [dataSets, setDataSets] = useState([]);
//   const [normalizations, setNormalizations] = useState([]);

//   const [selectedTab, setSelectedTab] = useState(0);

//   const dispatch = useDispatch();

//   const dispathcSetLoop = (loop) => {
//     dispatch(setLoop(loop));
//   };

//   const dispatchSelectAlgos = (algos) => {
//     dispatch(setSelectedAlgos(algos));
//   };
//   const dispatchSelectDs = (ds) => {
//     dispatch(setSelectedDatasets(ds));
//   };

//   const dispatchSelectNormalizations = (no) => {
//     dispatch(setSelectedNormalizations(no));
//   };

//   useEffect(() => {
//     ipcRenderer.send("index-window-loaded");
//     ipcRenderer.on(
//       "algorithms",
//       (e, { message: algorithms, status, disabledCount }) => {
//         if (status !== "error") {
//           setalgorithms({ content: algorithms, disabledCount });
//         }
//       }
//     );
//     ipcRenderer.on("datasets", (e, { message: datasets, status }) => {
//       if (status !== "error") {
//         setDataSets({ content: datasets });
//       }
//     });
//     ipcRenderer.on(
//       "normalizations",
//       (e, { message: normalizations, status }) => {
//         if (status !== "error") {
//           setNormalizations({ content: normalizations });
//         }
//       }
//     );
//   }, []);

//   const handleLoopInput = (e) => {
//     let value = e.target.value;
//     dispathcSetLoop(parseInt(value));
//   };

//   return (
//     <>
//       <Category>
//         <Category.Title>Loop</Category.Title>
//         <input
//           type={"number"}
//           min={2}
//           max={10000}
//           value={loop}
//           onChange={handleLoopInput}
//         />
//       </Category>
//       <TabWrapper
//         selected={selectedTab}
//         tabs={[
//           { label: "Algoritmalar", index: 0 },
//           { label: "Datasetler", index: 1 },
//           { label: "Normalizasyonlar", index: 2 },
//         ]}
//         onSelect={(index) => {
//           setSelectedTab(index.index);
//         }}
//       />
//       {selectedTab === 0 && (
//         <CategoryTab
//           defaultSelected={selectedAlgorithms}
//           key={selectedTab}
//           onSelect={(al) => {
//             dispatchSelectAlgos(al);
//           }}
//           data={algorithms}
//           placeholder="Algoritma Ara"
//           title="Algoritmalar"
//         />
//       )}
//       {selectedTab === 1 && (
//         <CategoryTab
//           defaultSelected={selectedDatasets}
//           key={selectedTab}
//           onSelect={(ds) => {
//             dispatchSelectDs(ds);
//           }}
//           data={dataSets}
//           placeholder="Dataset Ara"
//           title="Datasetler"
//         />
//       )}
//       {selectedTab === 2 && (
//         <CategoryTab
//           defaultSelected={selectedNormalizations}
//           key={selectedTab}
//           onSelect={(no) => {
//             dispatchSelectNormalizations(no);
//           }}
//           data={normalizations}
//           placeholder="Normalizasyon Ara"
//           title="Normalizasyonlar"
//         />
//       )}
//     </>
//   );
// };

const IndexPage = () => {
  const dispatch = useDispatch();

  const [data, setData] = useState([]);

  useEffect(() => {
    ipcRenderer.on("log-from-main", (e, data) => {
      console.log(data);
    });
  }, []);

  return (
    <div className="index-page">
      <div className="drag-area--container">
        <DragArea
          onDrop={(data) => {
            dispatch(setSelectedAlgos(data));
          }}
          accept="algorithms"
          title={"Algoritmalar"}
        />
        <DragArea
          onDrop={(data) => {
            dispatch(setSelectedDatasets(data));
          }}
          accept="datasets"
          title={"Datasetler"}
        />
        <DragArea
          onDrop={(data) => {
            dispatch(setSelectedNormalizations(data));
          }}
          accept="normalizations"
          title={"Normalizasyonlar"}
        />
      </div>
      <Output />
    </div>
  );
};

export default IndexPage;
