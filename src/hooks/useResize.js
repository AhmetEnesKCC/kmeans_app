const { useRef, useEffect, useState, useCallback } = require("react");

const useResize = (
  rotation = "horizontal",
  maxSize = 100,
  minSize = 50,
  defaultSize
) => {
  const resizeAreaRef = useRef(null);
  const indicatorRef = useRef(null);

  const [click, setClick] = useState(false);

  const [size, setSize] = useState(defaultSize);

  const [resizeAmount, setResizeAmount] = useState({
    x: 0,
    y: 0,
  });

  const mouseMove = useCallback((e) => {
    setResizeAmount({
      x: 1 * e.movementX,
      y: -1 * e.movementY,
    });
  }, []);

  useEffect(() => {
    const newSize =
      size + (rotation === "horizontal" ? resizeAmount.x : resizeAmount.y);
    if (newSize <= maxSize && newSize >= minSize) {
      setSize(newSize);
    }
  }, [resizeAmount]);

  const addMouseMove = useCallback(() => {
    window.addEventListener("mousemove", mouseMove);
  }, [resizeAmount]);

  const removeMouseMove = useCallback(() => {
    window.removeEventListener("mousemove", mouseMove);
  }, [resizeAmount]);

  useEffect(() => {
    if (resizeAreaRef.current && indicatorRef.current) {
      indicatorRef.current.addEventListener("mousedown", () => {
        setClick(true);
      });

      window.addEventListener("mouseup", () => {
        setClick(false);
      });
    }
  }, [resizeAreaRef.current, indicatorRef.current]);

  useEffect(() => {
    if (click) {
      addMouseMove();
    } else {
      removeMouseMove();
    }
  }, [click, indicatorRef.current]);

  useEffect(() => {
    if (resizeAreaRef.current) {
      if (size <= maxSize && size >= minSize) {
        resizeAreaRef.current.style[
          rotation === "vertical" ? "height" : "width"
        ] = size + "px";
      }
    }
  }, [size]);

  return {
    resizeAreaRef,
    indicatorRef,
    size,
    resizeAmount,
  };
};

export default useResize;
