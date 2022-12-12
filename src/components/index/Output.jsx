import { useEffect } from "react";
import { useRef } from "react";
import { useState } from "react";
import { IoIosArrowUp, IoMdClose } from "react-icons/io";
import { BsTerminal, BsGraphUp } from "react-icons/bs";
import { VscOutput } from "react-icons/vsc";
import { useSelector } from "react-redux";

import ResizableArea from "../ResizableArea";

import { red, white } from "tailwindcss/colors";
import Chart from "./Chart";
import { useCallback } from "react";
import {
  ActionIcon,
  Badge,
  Box,
  Button,
  Code,
  Divider,
  Group,
  MultiSelect,
  Stack,
  Switch,
  Text,
} from "@mantine/core";
import { AiOutlineReload, AiOutlineSolution } from "react-icons/ai";
import { Prism } from "@mantine/prism";

const { ipcRenderer } = window.require("electron");

const Output = () => {
  const [outputMessage, setOutputMessage] = useState([]);
  const [outputStep, setOutputStep] = useState(0);

  const [result, setResult] = useState(null);
  const [tab, setTab] = useState("terminal");

  const [detailed, setDetailed] = useState(false);

  const selectedArguments = useSelector((state) => state.selectedArguments);

  const codeStatus = useSelector((state) => state.codeStatus);

  const [multiFilter, setMultiFilter] = useState([]);

  const outputRef = useRef(null);

  const [progress, setProgress] = useState(0);
  const [status, setStatus] = useState(null);

  useEffect(() => {
    const multiplication =
      selectedArguments.data.length *
      selectedArguments.algo.length *
      (selectedArguments.norm.length + 1) *
      selectedArguments.loop;
    if (multiplication !== 0) {
      setProgress(
        Math.floor(
          (outputStep * 100) /
            (selectedArguments.data.length *
              selectedArguments.algo.length *
              (selectedArguments.norm.length + 1) *
              selectedArguments.loop)
        )
      );
    } else {
      setProgress(100);
    }
  }, [outputStep]);

  useEffect(() => {
    setTab("terminal");
  }, [codeStatus]);

  useEffect(() => {
    if (progress >= 100) {
      setStatus("done");
    }
  }, [progress]);

  useEffect(() => {
    ipcRenderer.on("output-start", (e, data) => {
      setOutputMessage([{ message: "Start", type: "start" }]);
      setOutputStep(0);
      setStatus(null);
    });

    ipcRenderer.on("output-message-print", (e, data) => {
      if (data.includes("-step-")) {
        setOutputMessage((m) => [...m, { message: data, type: "detail" }]);
        setOutputStep((s) => s + 1);
      } else {
        setOutputMessage((m) => [...m, { message: data, type: "print" }]);
      }
    });

    ipcRenderer.on("output-error", (e, data) => {
      setOutputMessage((m) => [...m, { message: data, type: "error" }]);
      setStatus("error");
    });

    ipcRenderer.on("output-close", (e, data) => {
      setOutputMessage((m) => [...m, { message: "End", type: "end" }]);
    });

    ipcRenderer.on("output-result", (e, data) => {
      setResult(JSON.parse(data));
    });
  }, []);

  useEffect(() => {
    if (outputRef.current && tab === "terminal") {
      outputRef.current.scroll({
        top: outputRef.current.scrollHeight,
        behavior: "smooth",
      });
    }
  }, [outputMessage]);

  useEffect(() => {
    if (outputRef.current && tab === "terminal") {
      outputRef.current.scroll({
        top: 0,
      });
    }
  }, [tab]);

  const runCode = useCallback(() => {
    ipcRenderer.send("run", selectedArguments);
  }, []);

  useEffect(() => {
    runCode();
  }, []);

  const [maximize, setMaximize] = useState(false);

  const handleMaximize = useCallback(() => {
    setMaximize(!maximize);
  }, [maximize]);

  return (
    <Stack
      sx={(theme) => ({
        width: "100%",
        height: "100%",
        backgroundColor: "white",
        boxShadow: theme.shadows.md,
      })}
      p={3}
      px={6}
    >
      <Box
        sx={(theme) => ({
          width: "100%",
          height: 6,
          background: "transparent",
          borderRadius: theme.radius.md,
        })}
        py={2}
        px={1}
      >
        {outputMessage.length > 0 && !status && (
          <Box
            sx={(theme) => ({
              backgroundColor: theme.colors.green[8],
              width: progress + "%",
              height: "100%",
              borderRadius: theme.radius.md,
            })}
          ></Box>
        )}
      </Box>
      <Group className="flex p-2 gap-x-2 output-tabs">
        <div
          onClick={() => {
            setTab("terminal");
          }}
          className={tab === "terminal" && "selected"}
        >
          <Button
            variant={tab === "terminal" ? "filled" : "outline"}
            rightIcon={<BsTerminal />}
            color={"green.6"}
          >
            Terminal
          </Button>
        </div>
        {status === "done" && (
          <>
            <div
              onClick={() => {
                setTab("graph");
              }}
              className={tab === "graph" && "selected"}
            >
              <Button
                variant={tab === "graph" ? "filled" : "outline"}
                color={"orange.5"}
                rightIcon={<BsGraphUp />}
              >
                Graph
              </Button>
            </div>
            <div
              onClick={() => {
                setTab("result");
              }}
              className={tab === "result" && "selected"}
            >
              <Button
                variant={tab === "result" ? "filled" : "outline"}
                color={"violet.5"}
                rightIcon={<AiOutlineSolution />}
              >
                Result
              </Button>
            </div>
          </>
        )}

        <div
          onClick={() => {
            setTab("arguments");
          }}
          className={tab === "table" && "selected"}
        >
          <Button
            variant={tab === "arguments" ? "filled" : "outline"}
            rightIcon={<VscOutput />}
            color={"blue.6"}
          >
            Arguments
          </Button>
        </div>
      </Group>
      <Group position="apart">
        <Group p={4}>
          {status === "done" && <Badge color="green">Done</Badge>}
          {status === null && <Badge color="orange">Processing</Badge>}
          {status === "error" && <Badge color="red">Error</Badge>}
          <Text weight="bold">{progress && progress + "%"}</Text>
        </Group>
        {["done", "error"].includes(status) && (
          <Button
            onClick={runCode}
            variant="subtle"
            rightIcon={<AiOutlineReload />}
          >
            Aynı Argümanlarla Yeniden Çalıştır
          </Button>
        )}
      </Group>

      {tab === "graph" &&
        result.map((r) => {
          const createOptions = (prop, title) => {
            return {
              theme: {
                mode: "dark",
              },
              tooltip: {
                theme: "dark",
              },
              dataLabels: {
                enabled: false,
              },
              labels: {
                styles: {
                  colors: ["white"],
                },
              },
              chart: {
                type: "bar",
                foreColor: "white",
              },
              series: [
                {
                  name: title,
                  data: r.series[prop],
                  colors: [],
                  show: false,
                },
              ],
              xaxis: {
                categories: r.categories,
              },
            };
          };
          return (
            <Stack>
              <Text>{r.labelWOExt}</Text>
              <Group grow spacing={12}>
                <Chart
                  title={"Time"}
                  chartOptions={createOptions("time", "time")}
                />
                <Chart
                  title={"SSE"}
                  chartOptions={createOptions("sse", "sse")}
                />
              </Group>
            </Stack>
          );
        })}
      {tab === "terminal" && (
        <Stack
          sx={{
            width: "100%",
            height: "100%",
            overflow: "hidden",
          }}
          align="start"
          justify="flex-start"
          spacing={10}
          p={4}
        >
          <Switch
            value={detailed}
            onChange={(e) => {
              setDetailed(!detailed);
            }}
            label="Show Details"
            sx={{
              alignSelf: "flex-end",
            }}
          />
          <MultiSelect
            label="Output Tipleri"
            color="red"
            onChange={(v) => {
              setMultiFilter(v);
            }}
            data={[
              {
                label: "Error",
                value: "error",
              },
              {
                label: "Detail",
                value: "detail",
              },
              {
                label: "Print",
                value: "print",
              },
              {
                label: "End",
                value: "end",
              },
              {
                label: "Start",
                value: "start",
              },
            ]}
          />
          <Divider color="gray.1" sx={{ width: "100%" }} />
          <Box sx={{ flex: 1, overflow: "auto", width: "100%" }}>
            <Stack sx={{ width: "100%" }}>
              {outputMessage
                .filter((d) =>
                  multiFilter.length === 0 ? d : multiFilter.includes(d.type)
                )
                .filter((d) => {
                  return detailed ? d : d.type !== "detail";
                })
                .map((om, i) => (
                  <Group
                    sx={{ width: "100%", height: "100%", overflow: "auto" }}
                    position="apart"
                    noWrap
                    align="start"
                    key={i}
                  >
                    <Group>
                      <Text
                        weight={"bold"}
                        align="right"
                        sx={(theme) => ({
                          backgroundColor: theme.colors.gray[1],
                          opacity: 0.7,
                          width: 80,
                        })}
                      >
                        {i + 1}
                      </Text>
                      <Divider orientation="vertical" />
                      <Text>{om.message}</Text>
                    </Group>
                    {om.type === "start" && (
                      <Badge color={"green"}>Started</Badge>
                    )}
                    {om.type === "end" && <Badge color={"blue"}>End</Badge>}
                    {om.type === "print" && (
                      <Badge color={"orange"}>Print</Badge>
                    )}
                    {om.type === "detail" && (
                      <Badge color={"indigo"}>Detail</Badge>
                    )}
                    {om.type === "error" && <Badge color={"red"}>Error</Badge>}
                  </Group>
                ))}
            </Stack>
          </Box>
        </Stack>
      )}
      {tab === "arguments" && (
        <Prism
          sx={{
            overflow: "auto",
          }}
          language="json"
        >
          {JSON.stringify(selectedArguments, null, 4)}
        </Prism>
      )}
      {tab === "result" && (
        <Prism
          sx={{
            overflow: "auto",
          }}
          language="json"
        >
          {JSON.stringify(result, null, 4)}
        </Prism>
      )}

      {/* <div className="output-title">
        <span className="flex items-center gap-x-4">
          Output {progress > 0 && progress < 100 && <div>{progress}%</div>}
          {status === "done" && (
            <div className="bg-green-300 text-green-800 px-2 w-max rounded-sm">
              Done
            </div>
          )}
          <div
            className="cursor-pointer hover:bg-white hover:bg-opacity-20  p-2"
            onClick={() => {
              setDetailed(!detailed);
            }}
          >
            {tab === "terminal"
              ? detailed
                ? "Hide Detail"
                : "Show Detail"
              : ""}
          </div>
          {status === "error" && (
            <div
              style={{ backgroundColor: red[300], color: red[800] }}
              className="px-2 w-max rounded-sm"
            >
              Error
            </div>
          )}
        </span>
        
        <span className="flex gap-x-2">
          <IoIosArrowUp
            onClick={() => {
              handleMaximize();
            }}
            className={`output-icon ${maximize ? "rotate-180" : ""}`}
          />
          <IoMdClose
            onClick={() => {
              setOutputMessage([]);
              setTab("terminal");
            }}
            className={`output-icon ${maximize ? "rotate-180" : ""}`}
          />
        </span>
      </div>

      {outputMessage.length > 1 && !status && (
        <div className="output-progress">
          <div
            className={`output-progress-line`}
            style={{
              width: `${progress}%`,
            }}
          ></div>
        </div>
      )}

      <div ref={outputRef} className="output-content">
        {tab === "terminal" &&
          outputMessage
            .filter((d) => {
              return detailed ? d : d.type !== "detail";
            })
            .map((om, i) => (
              <div className={om.type} key={i}>
                {om.message}
              </div>
            ))}
        {tab === "graph" &&
          result.map((r) => {
            const createOptions = (prop, title) => {
              return {
                theme: {
                  mode: "dark",
                },
                tooltip: {
                  theme: "dark",
                },
                dataLabels: {
                  enabled: false,
                },
                labels: {
                  styles: {
                    colors: ["white"],
                  },
                },
                chart: {
                  type: "bar",
                  foreColor: "white",
                },
                series: [
                  {
                    name: title,
                    data: r.series[prop],
                    colors: [],
                    show: false,
                  },
                ],
                xaxis: {
                  categories: r.categories,
                },
              };
            };

            return (
              <div className="flex flex-col">
                <div className="font-bold text-opacity-80 bg-white text-black w-max px-3 rounded-md mb-4">
                  {r.labelWOExt}
                </div>
                <div className="grid grid-cols-2 gap-x-4 mb-10  p-3">
                  <Chart
                    title={"Time"}
                    chartOptions={createOptions("time", "time")}
                  />
                  <Chart
                    title={"SSE"}
                    chartOptions={createOptions("sse", "sse")}
                  />
                </div>
              </div>
            );
          })}
      </div> */}
    </Stack>
  );
};

export default Output;
