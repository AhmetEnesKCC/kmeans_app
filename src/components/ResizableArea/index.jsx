import { forwardRef } from "react";
import useResize from "../../hooks/useResize";

import "../../styles/resizable.css";

const ResizableArea = ({
  className,
  children,
  rotation,
  maxSize = 100,
  minSize = 50,
  defaultSize = 100,
  bg = "black",
}) => {
  const { resizeAreaRef, indicatorRef } = useResize(
    ["top", "bottom"].includes(rotation) ? "vertical" : "horizontal",
    maxSize,
    minSize,
    defaultSize
  );

  return (
    <div
      style={
        ["top", "bottom"].includes(rotation)
          ? { height: defaultSize }
          : { width: defaultSize }
      }
      ref={resizeAreaRef}
      className={`resizable-area ${className ?? ""}`}
    >
      <ResizeIndicator bg={bg} ref={indicatorRef} rotation={rotation} />
      {children}
    </div>
  );
};

const ResizeIndicator = forwardRef(({ rotation, bg = "black" }, ref) => {
  return (
    <div
      ref={ref}
      className={`resize-indicator indicator-${rotation} hover:bg-[${bg}]`}
    ></div>
  );
});

export default ResizableArea;
