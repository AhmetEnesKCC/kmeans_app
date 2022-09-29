import { useEffect, useState } from "react";
import { useDrop } from "react-dnd";
import { useSelector } from "react-redux";

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
        {title}{" "}
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
      <div className="drag-area--content">
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
