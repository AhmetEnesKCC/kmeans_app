import { FaFileCsv } from "react-icons/fa";
import { DiPython } from "react-icons/di";
import { useDrag } from "react-dnd";
import { useDispatch } from "react-redux";
import { setContentInfo } from "../../../../redux/infoSlice";

const File = ({ children, ext, data }) => {
  const dispatch = useDispatch();

  const [{ isDragging }, drag, preview] = useDrag(() => {
    return {
      type: data.fileType,
      item: data,
      collect: (monitor) => {
        return {
          isDragging: !!monitor.isDragging(),
        };
      },
    };
  }, []);
  return (
    <div
      onClick={() => {
        dispatch(setContentInfo(data));
      }}
      className={`file ${isDragging ? "dragging" : ""}`}
      ref={drag}
    >
      <hr />
      <div className="content">{children}</div>
    </div>
  );
};

export default File;
