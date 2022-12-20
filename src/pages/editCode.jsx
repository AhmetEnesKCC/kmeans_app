import { Badge, Box, Button, Group, Stack, Text } from "@mantine/core";
import { showNotification } from "@mantine/notifications";
import { useEffect } from "react";
import { useState } from "react";
import { BsClipboard, BsEye, BsNewspaper, BsPlus } from "react-icons/bs";

const { ipcRenderer } = window.require("electron");

const EditCode = () => {
  const [fileData, setFileData] = useState("");

  const previewCode = () => {
    ipcRenderer.send("main:read");
  };
  const copyCode = () => {
    ipcRenderer.send("main:read");
  };
  const generateCode = () => {
    ipcRenderer.send("main:generate");
  };

  useEffect(() => {
    ipcRenderer.on("main:read-ok", (e, fileData) => {
      setFileData(fileData);
    });
    ipcRenderer.on("main:generate-ok", () => {
      showNotification({
        message: "Generated successfuly",
        color: "green",
      });
    });
  }, []);

  return (
    <Box
      sx={{
        width: "100%",
        height: "100%",
        overflow: "hidden",
      }}
    >
      <Stack
        align={"start"}
        sx={{
          width: "100%",
          height: "100%",
        }}
      >
        <Badge color="blue.5">Editor Tools</Badge>
        <Badge color={"teal"}>main.py</Badge>
        <Group>
          <Stack
            align={"center"}
            px={20}
            py={12}
            pb={4}
            sx={(theme) => ({
              backgroundColor: theme.colors.orange[5],
              height: 120,
              borderRadius: theme.radius.md,
            })}
            onClick={previewCode}
          >
            <Text
              sx={{
                color: "white",
              }}
            >
              Preview
            </Text>
            <BsEye style={{ color: "white" }} size={40} />
          </Stack>
          <Stack
            align={"center"}
            px={20}
            py={12}
            pb={4}
            onClick={copyCode}
            sx={(theme) => ({
              backgroundColor: theme.colors.teal[5],
              height: 120,
              borderRadius: theme.radius.md,
            })}
          >
            <Text
              sx={{
                color: "white",
              }}
            >
              Copy
            </Text>
            <BsClipboard style={{ color: "white" }} size={40} />
          </Stack>
          <Stack
            align={"center"}
            px={20}
            py={12}
            pb={4}
            sx={(theme) => ({
              backgroundColor: theme.colors.violet[5],
              height: 120,
              borderRadius: theme.radius.md,
            })}
          >
            <Text
              sx={{
                color: "white",
              }}
            >
              Generate
            </Text>
            <BsPlus style={{ color: "white" }} size={40} />
          </Stack>
        </Group>
      </Stack>
    </Box>
  );
};

export default EditCode;
