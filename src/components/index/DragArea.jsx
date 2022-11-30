import { Box, Button, Group, Stack, Text } from "@mantine/core";
import { useEffect, useState } from "react";
import { useDrop } from "react-dnd";
import { BiTrash } from "react-icons/bi";

import { RiDragDropLine } from "react-icons/ri";

const DragArea = ({ title, accept, onDrop, ...props }) => {
  const [data, setData] = useState([]);

  useEffect(() => {
    onDrop?.(data);
  }, [data]);

  const [{ canDrop }, drop] = useDrop(() => {
    return {
      accept,
      drop: (dropData) => {
        var dData = [];
        const handleIteratableData = (iterationData) => {
          iterationData.content.map((d) => {
            if (d.iteratable) {
              return handleIteratableData(d);
            } else {
              dData = [...dData, d];
              return true;
            }
          });
        };
        if (dropData.iteratable) {
          handleIteratableData(dropData);
          setData((d) => [...d, ...dData.filter((dD) => !data.includes(dD))]);
        } else {
          dData = dropData;
          if (!data.includes(dData)) {
            setData((d) => [...d, dData]);
          }
        }
      },
      collect: (monitor) => {
        return {
          canDrop: monitor.canDrop(),
        };
      },
    };
  }, [data]);

  return (
    <div
      className={`drag-area  ${canDrop ? "droppable" : ""} ${
        props.className ? props.className : ""
      } `}
      ref={drop}
    >
      <div className="drag-area--title">
        <Stack align={"center"} sx={{ width: "100%" }}>
          <Box
            sx={{
              textAlign: "center",
              fontSize: 50,
              opacity: 0.3,
              margin: "4px",
            }}
          >
            {props.icon}
          </Box>
          <Group sx={{ marginBottom: 10 }}>
            {data.length > 0 && (
              <Button
                className="drag-area--clean"
                leftIcon={<BiTrash />}
                color={"red"}
                onClick={() => {
                  setData([]);
                }}
              >
                Temizle
              </Button>
            )}
            <Text align="center" size={18} weight="lighter">
              {title}
            </Text>
          </Group>
        </Stack>
      </div>
      <div className="drag-area--content">
        {data.length === 0 && (
          <Stack
            justify={"center"}
            align="center"
            sx={{ flex: 1, width: "100%", height: "100%" }}
          >
            <RiDragDropLine opacity={0.3} size={60} />
          </Stack>
        )}
        {data.map((d) => (
          <div
            className="drag-area--data"
            onClick={() => {
              setData(data.filter((dd) => dd !== d));
            }}
          >
            {d.labelWOExt}
          </div>
        ))}
      </div>
    </div>
  );
};

export default DragArea;
