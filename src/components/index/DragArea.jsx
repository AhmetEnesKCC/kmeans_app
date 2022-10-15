import { Box, Stack, Text } from "@mantine/core";
import { useEffect, useState } from "react";
import { useDrop } from "react-dnd";
import { useSelector } from "react-redux";

import { RiDragDropLine, RiRouteLine } from "react-icons/ri";

import "../../styles/drag.css";

const DragArea = ({ title, accept, onDrop, ...props }) => {
  const [data, setData] = useState([]);
  const codeStatus = useSelector((state) => state.codeStatus);

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
      } ${
        codeStatus === "pressed-run" && data.length === 0 && "animate-warn-user"
      }`}
      ref={drop}
    >
      <div className="drag-area--title">
        <Stack align={"center"} sx={{ width: "100%" }}>
          <Text align="center" size={18} weight="lighter">
            {title}
          </Text>
          <Box sx={{ width: 80, height: 80 }}>
            <RiRouteLine className="w-full h-auto opacity-20" />
          </Box>
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
      {data.length > 0 && (
        <button
          className="drag-area--clean"
          onClick={() => {
            setData([]);
          }}
        >
          Temizle
        </button>
      )}
    </div>
  );
};

export default DragArea;
