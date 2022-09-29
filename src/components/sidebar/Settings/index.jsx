import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setLoop } from "../../../redux/argumentSlice";

const Settings = () => {
  const dispatch = useDispatch();
  const { loop } = useSelector((state) => state.selectedArguments);

  return (
    <div className="settings">
      <Input
        onChange={(e) => {
          dispatch(setLoop(parseInt(e.target.value)));
        }}
        type={"number"}
        label="Loop"
        value={loop}
        placeHolder="Loop Girin"
      />
    </div>
  );
};

const Input = ({ children, label, type, onChange, ...inputProps }) => {
  return (
    <div className="settings-input">
      <label>{label}</label>
      <input
        onChange={(e) => {
          onChange?.(e);
        }}
        type={type ?? "text"}
        {...inputProps}
      />
    </div>
  );
};

export default Settings;
