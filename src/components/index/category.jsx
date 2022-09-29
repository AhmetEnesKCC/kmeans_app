import { useState } from "react";
import { AiOutlineCheckCircle } from "react-icons/ai";

const Category = ({ children }) => {
  return <div className="category">{children}</div>;
};

Category.Title = ({ children }) => {
  return <h3 className="title">{children}</h3>;
};

Category.List = ({ children, onSelectAll }) => {
  return (
    <div className="list">
      <Category.All onClick={onSelectAll} />
      {children}
    </div>
  );
};

Category.ListItem = ({ children, onSelect, selected, disabled, reason }) => {
  return (
    <div
      onClick={() => {
        if (disabled) {
          return;
        }
        onSelect?.();
      }}
      className={`list-item ${selected ? "selected" : ""} ${
        disabled ? "disabled" : ""
      }`}
    >
      {children}
      {selected && <AiOutlineCheckCircle />}
      {reason && <div className="list-disable-reason">{reason}</div>}
    </div>
  );
};

Category.All = ({ onClick }) => {
  return (
    <div onClick={() => onClick?.()} className="all">
      Select All
    </div>
  );
};

export default Category;
