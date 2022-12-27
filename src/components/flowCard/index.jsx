import {
  ActionIcon,
  Box,
  Button,
  CopyButton,
  Divider,
  Group,
  Stack,
  Text,
} from "@mantine/core";
import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { setArgumentByKey, setArguments } from "../../redux/argumentSlice";
import { ImFileEmpty } from "react-icons/im";
import { BiClipboard, BiTrash } from "react-icons/bi";
import { FcInfo } from "react-icons/fc";
import { openModal } from "@mantine/modals";

const FlowCard = ({ flowKey }) => {
  const data = useSelector((state) => state.selectedArguments[flowKey]);

  const labelChanger = {
    algo: "Algorithms",
    data: "Datasets",
  };

  const dispatch = useDispatch();

  const handleClear = () => {
    dispatch(setArgumentByKey({ key: flowKey, value: [] }));
  };

  return (
    <Box
      sx={(theme) => ({
        maxHeight: "50%",
        minWidth: "30%",
        maxWidth: "100%",
      })}
    >
      <Stack
        sx={(theme) => ({
          borderColor: theme.colors.blue[4],
          boxShadow: theme.shadows.md,
          borderWidth: 2,
          borderStyle: "solid",
          height: "100%",
        })}
        p={2}
      >
        <Group position="apart" px={2}>
          <Text
            variant="h5"
            weight={"bold"}
            align="center"
            sx={(theme) => ({})}
          >
            {labelChanger[flowKey]}
          </Text>
          <Button
            onClick={handleClear}
            color={"red.5"}
            variant="subtle"
            px={2}
            py={1}
          >
            Temizle
          </Button>
        </Group>
        <Stack
          sx={(theme) => ({
            overflow: "auto",
            height: "100%",
          })}
          p={10}
        >
          {data?.length > 0 &&
            data.map((d) => {
              return <FlowCardItem data={d} />;
            })}
          {data?.length === 0 && (
            <Stack align="center">
              <ImFileEmpty size={40} opacity={0.2} />
            </Stack>
          )}
        </Stack>
      </Stack>
    </Box>
  );
};

const FlowCardItem = ({ data }) => {
  const dispatch = useDispatch();
  const selectedArguments = useSelector((state) => state.selectedArguments);

  const handleDelete = () => {
    const oldArguments = [...selectedArguments[data.fileType]];
    const newArguments = oldArguments.filter((a) => a.path !== data.path);
    dispatch(
      setArguments({ ...selectedArguments, [data.fileType]: newArguments })
    );
  };

  const handleInfo = () => {
    openModal({
      overflow: "inside",
      children: (
        <Stack>
          {Object.keys(data).map((key) => (
            <Stack
              spacing={3}
              sx={{
                position: "relative",
              }}
            >
              <CopyButton value={String(data[key])}>
                {({ copied, copy }) => (
                  <ActionIcon
                    variant={"outline"}
                    color={copied ? "green.5" : "gray.5"}
                    sx={(theme) => ({
                      position: "absolute",
                      right: 2,
                      top: 0,
                    })}
                    onClick={copy}
                  >
                    <BiClipboard />
                  </ActionIcon>
                )}
              </CopyButton>
              <Text transform="capitalize" weight="bold">
                {String(key)}
              </Text>
              <Text
                p={5}
                sx={(theme) => ({
                  background: theme.colors.gray[2],
                  color: theme.colors.gray[8],
                  overflow: "auto",
                })}
              >
                {String(data[key])}
              </Text>
            </Stack>
          ))}
        </Stack>
      ),
    });
  };

  return (
    <Group
      position="apart"
      p={2}
      px={4}
      sx={(theme) => ({
        color: theme.colorScheme === "dark" ? "white" : theme.colors.blue[8],
        cursor: "pointer",
        "&:hover": {
          backgroundColor:
            theme.colorScheme === "dark"
              ? theme.colors.gray[8]
              : theme.colors.gray[1],
        },
      })}
    >
      <Text>{data?.labelWOExt}</Text>
      <Group>
        <Box
          p={3}
          sx={(theme) => ({
            "&:hover": {
              background: theme.colors.red[5],
              color: "white",
              borderRadius: theme.radius.md,
            },
          })}
        >
          <BiTrash onClick={handleDelete} />
        </Box>
        <Box
          p={3}
          sx={(theme) => ({
            "&:hover": {
              background: theme.colors.gray[5],
              color: "white",
              borderRadius: theme.radius.md,
            },
          })}
        >
          <FcInfo onClick={handleInfo} />
        </Box>
      </Group>
    </Group>
  );
};

export default FlowCard;
