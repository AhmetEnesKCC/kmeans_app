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

import PageBox from "../components/Layout/PageBox";
import { useDispatch, useSelector } from "react-redux";
import { setArguments } from "../redux/argumentSlice";
import FlowCard from "../components/flowCard";
import { BiPlay } from "react-icons/bi";
import { Link } from "react-router-dom";

const { ipcRenderer } = window.require("electron");

const FlowBuilder = () => {
  const [data, setData] = useState([]);

  useEffect(() => {
    ipcRenderer.send("treeview-loaded");
    ipcRenderer.on("get-data", (e, eData) => {
      setData(eData);
    });
  }, []);

  return (
    <Group
      align="start"
      noWrap
      sx={{
        width: "100%",
        height: "100%",
        maxHeight: "100%",
        overflow: "hidden",
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
      <Stack component={PageBox} sx={{ flex: 1, alignSelf: "stretch" }} p={10}>
        <Box
          px={5}
          py={1}
          mb={6}
          sx={(theme) => ({
            backgroundColor: theme.colors.gray[1],
          })}
        >
          <Group position="apart">
            <Text
              size={"sm"}
              sx={{
                opacity: 0.7,
              }}
            >
              Aksiyonlar
            </Text>
            <Group>
              <Link to="/output">
                <ActionIcon size="lg" color="green">
                  <BiPlay />
                </ActionIcon>
              </Link>
            </Group>
          </Group>
        </Box>
        <Group
          position="center"
          spacing={10}
          p={4}
          align="stretch"
          sx={{
            boxSizing: "border-box",
            flex: 1,
            overflow: "auto",
          }}
        >
          <FlowCard flowKey={"algo"} />
          <FlowCard flowKey={"data"} />
          <FlowCard flowKey={"norm"} />
        </Group>
      </Stack>
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
    <Tabs.Panel value={d.fileType} sx={{ height: "100%" }}>
      <Stack sx={{ flex: 1, height: "100%", overflow: "hidden" }}>
        {/* <Input icon={<AiOutlineSearch />} placeholder="Search" /> */}
        <Box sx={{ flex: 1, height: "100%", overflow: "auto" }}>
          <FlowPanelContent data={d}>{d.label}</FlowPanelContent>
        </Box>
      </Stack>
    </Tabs.Panel>
  ));
};

const FlowPanelContent = ({ data = {}, showContent }) => {
  const [show, setShow] = useState(false);

  const [checked, setChecked] = useState(false);

  const dispatch = useDispatch();

  const selectedArguments = useSelector((state) => state.selectedArguments);

  const handleSelect = (data) => {
    let oldArguments = { ...selectedArguments };
    const newArguments = { ...oldArguments };
    const exist = oldArguments[data.fileType].some((d) => d.path === data.path);

    if (exist) {
      newArguments[data.fileType] = oldArguments[data.fileType].filter(
        (d) => d.path !== data.path
      );
    } else {
      newArguments[data.fileType] = [...oldArguments[data.fileType], data];
    }
    dispatch(setArguments(newArguments));
  };

  useEffect(() => {
    setChecked(
      selectedArguments[data.fileType].some((d) => d.path === data.path)
    );
  }, [selectedArguments]);

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
          handleSelect(data);
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
