import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import { DateTime } from "luxon";
import React, { useEffect, useState } from "react";

import { AiOutlineLoading } from "react-icons/ai";
import { useDispatch, useSelector } from "react-redux";
import OutputLine from "../components/output/outputLine";
import OutputWrapper from "../components/output/outputWrapper";
import ResultTable from "../components/output/resultTable";
import { setSelectedNormalizations } from "../redux/argumentSlice";
import { setCodeStatus } from "../redux/codeStatusSlice";

const { ipcRenderer } = window.require("electron");

const OutputPage = () => {
  const codeStatus = useSelector((state) => state.codeStatus);

  const [outputMessages, setOutputMessages] = useState([]);

  const [results, setResults] = useState([]);

  const [datasets, setDatasets] = useState([]);
  const [algorithms, setAlgorithms] = useState([]);
  const [normalizations, setNormalizations] = useState([]);

  const dispatch = useDispatch();

  const dispatchCodeStatus = (status) => {
    dispatch(setCodeStatus(status));
  };

  useEffect(() => {
    ipcRenderer.send("output-window-loaded");
  }, []);

  const generatePDF = () => {
    const data = document.querySelector("#pdf");
    const pdfWidth = parseInt(window.getComputedStyle(data).width);
    const pdfHeight = parseInt(window.getComputedStyle(data).height);
    const pdf = new jsPDF("portrait", "px", [pdfHeight, pdfWidth]);
    pdf.html(data).then(() => {
      pdf.save("output.pdf");
    });

    // const data = await html2canvas(document.querySelector("#pdf"));
    // const img = data.toDataURL("image/png");
    // const imgProperties = pdf.getImageProperties(img);
    // const pdfWidth = pdf.internal.pageSize.getWidth();
    // const pdfHeight = (imgProperties.height * pdfWidth) / imgProperties.width;
    // pdf.addImage(img, "PNG", 0, 0, pdfWidth, pdfHeight);
  };

  useEffect(() => {
    ipcRenderer.on(
      "arguments",
      (e, { datasets, algorithms, normalizations }) => {
        setDatasets(datasets);
        setAlgorithms(algorithms);
        setNormalizations(normalizations);
        setSelectedNormalizations();
      }
    );

    ipcRenderer.on("output-start", () => {
      dispatchCodeStatus("running");
      setOutputMessages((om) => [
        ...om,
        {
          type: "start",
          message: "Started at: " + DateTime.now().toString(),
        },
      ]);
    });

    ipcRenderer.on("output-message-print", (e, message) => {
      message = String(message);
      setOutputMessages((om) => [...om, { type: "print", message }]);
    });
    ipcRenderer.on("output-error", (e, message) => {
      setOutputMessages((om) => [
        ...om,
        { type: "error", message: String(message) },
      ]);
    });
    ipcRenderer.on("output-close", (e) => {
      dispatchCodeStatus("close");
      setOutputMessages((om) => [...om, { type: "end", message: "- End -" }]);
    });

    ipcRenderer.on("output-result", (e, data) => {
      setResults(JSON.parse(data));
    });

    ipcRenderer.on("reset", () => {
      setOutputMessages([]);
      setResults([]);
    });
  }, []);

  return (
    <div className="w-full min-w-max px-10 ">
      {codeStatus === "close" && (
        <button className="export-button" onClick={generatePDF}>
          Export as PDF
        </button>
      )}
      <div className="output-title">
        <h3 className="flex items-center justify-center w-max gap-x-4">
          {codeStatus === "running" && (
            <>
              {" "}
              Running Code
              <AiOutlineLoading className="animate-spin" />
            </>
          )}
          {codeStatus === "stop" && <>Stopped</>}
          {codeStatus === "close" && <>Output</>}
        </h3>
      </div>
      {codeStatus !== "stop" && (
        <OutputWrapper>
          {outputMessages.length > 0 &&
            outputMessages.map((m, i) => (
              <OutputLine key={i + "-message"}>{m.message}</OutputLine>
            ))}
        </OutputWrapper>
      )}
      {results && codeStatus === "close" && results.length > 0 && (
        <div id="pdf" className="bg-[#1a1926] p-4">
          <ResultTable
            datasets={datasets}
            algorithms={algorithms}
            normalizations={normalizations}
            results={results}
            prop={"sse"}
            title={"SSE"}
          />
          <ResultTable
            datasets={datasets}
            algorithms={algorithms}
            normalizations={normalizations}
            results={results}
            prop={"time"}
            title={"Time"}
          />
          {/* {results.map((result) => {
            return (
              <div key={result.algorithm_name + result.dataset_name}>
                <Table.Title>
                  {result.algorithm_name + " " + result.dataset_name}
                </Table.Title>
                <Table>
                  <thead>
                    <Table.Row>
                      {Object.keys(result).map((key) => (
                        <Table.Head key={key}>
                          {key.replace("-", " ").replace("_", " ")}
                        </Table.Head>
                      ))}
                    </Table.Row>
                  </thead>
                  <tbody>
                    <Table.Row>
                      {Object.values(result).map((val) => {
                        return <Table.Cell key={val}>{val}</Table.Cell>;
                      })}
                    </Table.Row>
                  </tbody>
                </Table>
              </div>
            );
          })} */}
        </div>
      )}
    </div>
  );
};

export default OutputPage;
