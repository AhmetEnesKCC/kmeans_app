import { useState } from "react";
import { BsChevronRight } from "react-icons/bs";
import { AiFillFolder, AiFillFolderOpen } from "react-icons/ai";
import { useDrag } from "react-dnd";

const Folder = ({ children, label, data }) => {
  const [collapsed, setCollapsed] = useState(false);

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

  const handleCollapse = () => {
    setCollapsed(!collapsed);
  };

  return (
    <div ref={drag} className={`folder`}>
      <div
        onClick={handleCollapse}
        className={`folder-label ${isDragging ? "dragging" : ""}`}
      >
        <div className="content">{label}</div>
        <BsChevronRight
          className={`${collapsed ? "rotate-90" : ""} treeview-icon`}
        />
      </div>
      {collapsed && <div className="folder-children">{children}</div>}
    </div>
  );
};

export default Folder;
