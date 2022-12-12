import { Box, Group, Stack, Text } from "@mantine/core";
import { Prism } from "@mantine/prism";
import { useState } from "react";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setLoading, setLoadingVisiblity } from "../../redux/uiSlice";
const { ipcRenderer } = window.require("electron");

const text = `const {
    readdirSync,
    writeFileSync,
    appendFileSync,
    readFileSync,
    statSync,
  } = require("fs");`;

const FilePreview = ({ file }) => {
  const [fileData, setFileData] = useState("");

  const dispatch = useDispatch();

  useEffect(() => {
    ipcRenderer.send("read-file", file.path);
    dispatch(
      setLoading({
        title: "Reading File",
        visible: true,
      })
    );
    ipcRenderer.on("file-data", (e, fileData) => {
      dispatch(setLoadingVisiblity(false));
      setFileData(fileData);
    });
  }, [file]);

  return (
    <Box p={2} sx={{}}>
      <Group
        noWrap
        sx={(theme) => ({
          borderColor: theme.colors.gray[3],
          borderWidth: 2,
          borderStyle: "solid",
        })}
        py={6}
        pr={4}
      >
        <Stack
          spacing={0}
          pl={15}
          pr={10}
          sx={{
            borderRight: "2px solid #fafafa",
          }}
        >
          {fileData.split("\n").map((t, i) => {
            return (
              <Text
                weight="bold"
                sx={{
                  opacity: 0.4,
                  lineHeight: "30px",
                  whiteSpace: "nowrap",
                }}
                align="right"
                size={12}
              >
                {i + 1}
              </Text>
            );
          })}
        </Stack>
        <Stack
          sx={{
            flex: 1,
            overflow: "auto",
          }}
          spacing={0}
        >
          <Prism
            p={0}
            language={"javascript" ?? "py"}
            sx={{
              "*": {
                backgroundColor: "transparent !important",
              },
              ".mantine-Prism-lineContent": {
                lineHeight: "30px",
              },
              lineHeight: "30px",
              width: "100% !important",
            }}
          >
            {fileData ?? ""}
          </Prism>
        </Stack>
      </Group>
    </Box>
  );
};

export default FilePreview;
