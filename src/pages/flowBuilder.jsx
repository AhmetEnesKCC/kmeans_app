import {
  ActionIcon,
  Box,
  Button,
  Grid,
  Group,
  Input,
  Navbar,
  Stack,
  Switch,
  Tabs,
  Text,
  Tooltip,
  UnstyledButton,
} from "@mantine/core";

import { useCallback, useRef } from "react";
import { useEffect, useState } from "react";

import { AiOutlineSearch } from "react-icons/ai";
import { RiArrowDropDownFill, RiArrowDropDownLine } from "react-icons/ri";
import { FcInfo } from "react-icons/fc";

import ReactFlow, {
  Background,
  Controls,
  applyEdgeChanges,
  applyNodeChanges,
} from "reactflow";
import PageBox from "../components/Layout/PageBox";

const { ipcRenderer } = window.require("electron");

const FlowBuilder = () => {
  const [data, setData] = useState([]);

  const [nodes, setNodes] = useState([
    {
      id: "1",
      position: { x: 0, y: 0 },
      type: "input",
      data: { label: "Datasets" },
    },
    {
      id: "2",
      position: { x: 100, y: 0 },
    },
  ]);
  const [edges, setEdges] = useState([]);

  useEffect(() => {
    ipcRenderer.send("treeview-loaded");
    ipcRenderer.on("get-data", (e, eData) => {
      setData(eData);
    });
  }, []);

  const onNodesChange = useCallback((changes) => {
    setNodes((nds) => applyNodeChanges(changes, nds));
  }, []);

  const onEdgesChange = useCallback((changes) => {
    setNodes((eds) => applyEdgeChanges(changes, eds));
  }, []);

  return (
    <Group
      align="start"
      noWrap
      sx={{
        width: "100%",
        height: "100%",
      }}
    >
      <Box sx={{ height: "100%", overflow: "hidden" }} component={PageBox}>
        <Tabs
          defaultValue={"pop"}
          component={Stack}
          sx={{
            height: "100%",
            flex: 1,
          }}
          p={20}
        >
          <Tabs.List>
            <FlowTabList data={data} />
          </Tabs.List>
          <Box
            sx={{
              overflow: "auto",
              flex: 1,
            }}
            p={6}
          >
            <FlowTabPanel data={data} />
          </Box>
        </Tabs>
      </Box>
      <Box component={PageBox} sx={{ flex: 1, alignSelf: "stretch" }}>
        a
      </Box>
    </Group>
  );
};

const FlowTabList = ({ data = [] }) => {
  return data.map((d) => (
    <Tabs.Tab key={data.fileType} value={d.fileType}>
      {d.label}
    </Tabs.Tab>
  ));
};

const FlowTabPanel = ({ data = [] }) => {
  return data.map((d) => (
    <Tabs.Panel value={d.fileType} className="h-full">
      <Stack className="flex-1 h-full overflow-hidden">
        <Input icon={<AiOutlineSearch />} placeholder="Search" />
        <Box className="flex-1 h-full overflow-auto p-2">
          <FlowPanelContent data={d}>{d.label}</FlowPanelContent>
        </Box>
      </Stack>
    </Tabs.Panel>
  ));
};

const FlowPanelContent = ({ data = {}, showContent }) => {
  const [show, setShow] = useState(false);

  const [checked, setChecked] = useState(false);

  const switchRef = useRef(null);

  if (data.iteratable) {
    return (
      <Stack>
        <UnstyledButton
          onClick={() => {
            setShow(!show);
          }}
          p={2}
        >
          <Group position="apart">
            <Text>{data.label}</Text>
            <Box
              sx={(theme) => ({
                transform: "rotate(" + (show ? 180 : 0) + "deg)",
                transition: "0.24s linear",
              })}
            >
              <RiArrowDropDownLine color="gray" size={30} />
            </Box>
          </Group>
        </UnstyledButton>
        {show && (
          <Stack ml={30}>
            {data.content.map((d) => (
              <FlowPanelContent showContent={show} data={d} />
            ))}
          </Stack>
        )}
      </Stack>
    );
  } else {
    return (
      <Group
        position="apart"
        spacing={20}
        noWrap
        onClick={() => {
          setChecked(!checked);
        }}
        p={8}
        sx={(theme) => ({
          cursor: "pointer",
          "&:hover": {
            boxShadow: theme.shadows.md,
          },
        })}
      >
        <Text lineClamp={1} sx={{ whiteSpace: "nowrap" }}>
          {data.labelWOExt}
        </Text>
        <Group noWrap>
          <Switch
            checked={checked}
            onChange={(e) => {
              setChecked(e.currentTarget.checked);
            }}
            sx={{ pointerEvents: "none" }}
            ref={switchRef}
          />
          <Tooltip label={data.ext}>
            <ActionIcon>
              <FcInfo />
            </ActionIcon>
          </Tooltip>
        </Group>
      </Group>
    );
  }
};

export default FlowBuilder;
