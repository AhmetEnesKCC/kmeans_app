import { useEffect } from "react";
import { useRef } from "react";
import { useState } from "react";
import { IoIosArrowUp, IoMdClose } from "react-icons/io";
import { BsTerminal, BsGraphUp, BsDownload } from "react-icons/bs";
import { VscOutput } from "react-icons/vsc";
import { useSelector } from "react-redux";

import Chart from "../components/index/Chart";
import { useCallback } from "react";
import {
  ActionIcon,
  Badge,
  Box,
  Button,
  Dialog,
  Divider,
  Group,
  MultiSelect,
  NumberInput,
  Paper,
  Stack,
  Switch,
  Table,
  Text,
  Tooltip,
} from "@mantine/core";
import {
  AiOutlineClose,
  AiOutlineReload,
  AiOutlineSolution,
} from "react-icons/ai";
import { Prism } from "@mantine/prism";
import { useClickOutside, useClipboard, useElementSize } from "@mantine/hooks";
import html2canvas from "html2canvas";
import { showNotification, cleanNotifications } from "@mantine/notifications";

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

  const imgRef = useRef(null);

  const downloadAsPng = async () => {
    const canvas = await html2canvas(imgRef.current);
    const dataURL = canvas.toDataURL();
    ipcRenderer.send("download-png", dataURL);
  };

  useEffect(() => {
    const multiplication =
      selectedArguments.data.length *
      selectedArguments.algo.length *
      selectedArguments.loop;
    if (multiplication !== 0) {
      setProgress(
        Math.floor(
          (outputStep * 100) /
            (selectedArguments.data.length *
              selectedArguments.algo.length *
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

  const { ref: GridRef, height, width } = useElementSize();

  const [fixto, setFixto] = useState(4);

  return (
    <Stack
      sx={(theme) => ({
        width: "100%",
        height: "100%",
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
                setTab("table");
              }}
              className={tab === "table" && "selected"}
            >
              <Button
                variant={tab === "table" ? "filled" : "outline"}
                color={"lime.8"}
                rightIcon={<BsGraphUp />}
              >
                Table
              </Button>
            </div>
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

      {tab === "graph" && (
        <Box sx={{ overflow: "auto" }}>
          {result.map((r) => {
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
                <Group grow noWrap spacing={12} p={3}>
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
        </Box>
      )}

      {tab === "table" && (
        <Stack
          style={{
            width: "100%",
            height: "100%",
          }}
        >
          <Button
            variant="subtle"
            rightIcon={<BsDownload />}
            onClick={downloadAsPng}
          >
            Download As PNG
          </Button>
          <NumberInput
            value={fixto}
            onChange={(v) => {
              if (v > 0 && v < 20) {
                setFixto(Math.floor(v));
              }
            }}
            label="Virgülden Sonraki Basamak"
            min={1}
            max={20}
          />
          <Box
            style={{
              width: "100%",
              height: "100%",
              overflow: "auto",
            }}
          >
            <Group
              component={Paper}
              noWrap
              ref={imgRef}
              spacing={0}
              align="flex-start"
              sx={{ width: "max-content" }}
            >
              <Stack spacing={0}>
                <Table sx={{ opacity: 0 }} withBorder withColumnBorders>
                  <tbody>
                    <tr>
                      <td style={{ opacity: 0 }}>.</td>
                    </tr>
                    <tr>
                      <td style={{ opacity: 0 }}>.</td>
                    </tr>
                  </tbody>
                </Table>
                <Table
                  withBorder
                  striped
                  sx={{
                    width: "max-content",
                    "th, tr": {
                      whiteSpace: "nowrap",
                    },
                    position: "sticky",
                    left: 0,
                  }}
                >
                  <tbody>
                    {selectedArguments.algo.map((al) => {
                      return (
                        <tr>
                          <td>{al.labelWOExt}</td>
                        </tr>
                      );
                    })}
                  </tbody>
                </Table>
              </Stack>

              {selectedArguments.data.map((d) => {
                return (
                  <Stack spacing={0}>
                    <Table withBorder withColumnBorders>
                      <thead>
                        <tr>
                          <th style={{ textAlign: "center" }}>{d.label}</th>
                        </tr>
                      </thead>
                    </Table>
                    <Table withBorder withColumnBorders striped>
                      <thead>
                        <tr>
                          <th>SSE</th>
                          <th>RANK</th>
                        </tr>
                      </thead>
                      <ResultTableBody
                        fixTo={fixto}
                        selectedArguments={selectedArguments}
                        result={result}
                        data={d}
                      />
                    </Table>
                  </Stack>
                );
              })}
            </Group>
          </Box>
        </Stack>
      )}
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
            checked={detailed}
            onChange={(e) => {
              setDetailed(e.target.checked);
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
          <Divider sx={{ width: "100%" }} />
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
                          backgroundColor:
                            theme.colors.gray[
                              theme.colorScheme === "dark" ? 7 : 1
                            ],
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
    </Stack>
  );
};

const DialogBody = ({ sse, onClose, defaultFixTo }) => {
  const [fixto, setFixto] = useState(defaultFixTo ?? 4);
  const clipboard = useClipboard();

  const fixed = useCallback(() => {
    return sse?.toFixed(fixto);
  }, [fixto, sse]);

  const handleCopy = (str) => {
    clipboard.copy(str);
    showNotification({
      message: "Kopyalandı: " + str,
      color: "green",
    });
    onClose?.();
  };

  return (
    <Stack>
      <ActionIcon onClick={onClose}>
        <AiOutlineClose />
      </ActionIcon>
      <Group>
        <Text>{sse}</Text>
        <Button onClick={() => handleCopy(sse)}>SSE Kopyala</Button>
      </Group>
      <Divider orientation="horizontal" />
      <Group noWrap>
        <Stack>
          <Text>{fixed()}</Text>
          <Group noWrap>
            <NumberInput
              min={1}
              max={20}
              step={1}
              label="Virgülden sonraki basamak"
              value={fixto}
              onChange={(v) => {
                if (v > 0 && v < 20) {
                  setFixto(Math.floor(v));
                }
              }}
            />
            <Button
              onClick={() => {
                handleCopy(fixed());
              }}
            >
              Kopyala
            </Button>
          </Group>
        </Stack>
      </Group>
    </Stack>
  );
};

const ResultTableBody = ({ selectedArguments, result, data: d, fixTo }) => {
  const resultData = result.find((r) => r.label === d.name);
  const sorted = resultData.data.map((d) => d.sse).sort();
  const [dialog, setDialog] = useState({
    visibility: false,
    data: 0,
    defaultFixTo: fixTo,
  });
  const ref = useClickOutside(() =>
    setDialog({
      visibility: false,
      data: 0,
      defaultFixTo: fixTo,
    })
  );
  return (
    <>
      <tbody>
        {selectedArguments.algo.map((al) => {
          const data = resultData.data.find(
            (d) => d.algorithm_name === al.label
          );
          const sse = data?.sse;

          const sseFixed = sse?.toFixed(fixTo ?? 4);
          return (
            <tr>
              <td
                onClick={() => {
                  setDialog({
                    visibility: true,
                    data: sse,
                    defaultFixTo: fixTo,
                  });
                }}
              >
                <Tooltip openDelay={500} label={data?.sse}>
                  <Text>{sseFixed ?? data.sse}</Text>
                </Tooltip>
              </td>
              <td
                style={{
                  textAlign: "center",
                }}
              >
                {sorted.indexOf(data?.sse) + 1}
              </td>
            </tr>
          );
        })}
      </tbody>
      <Dialog ref={ref} opened={dialog.visibility}>
        <DialogBody
          defaultFixTo={dialog.defaultFixTo}
          onClose={() => {
            setDialog({ visibility: false, data: 0 });
          }}
          sse={dialog.data}
        />
      </Dialog>
    </>
  );
};

export default Output;
