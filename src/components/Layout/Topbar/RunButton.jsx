import { Button } from "@mantine/core";
import { BsPlayFill } from "react-icons/bs";
import { useDispatch, useSelector } from "react-redux";
import { setCodeStatus } from "../../../redux/codeStatusSlice";

const { ipcRenderer } = window.require("electron");

const RunButton = () => {
  const dispatch = useDispatch();
  const selectedArguments = useSelector((state) => state.selectedArguments);

  return (
    <Button
      rightIcon={<BsPlayFill />}
      variant="outline"
      color={"green"}
      onClick={() => {
        const { algorithms, datasets, normalizations, loop } =
          selectedArguments;
        if (
          algorithms.length > 0 &&
          datasets.length > 0 &&
          normalizations.length > 0 &&
          loop > 0
        ) {
          ipcRenderer.send("run", selectedArguments);
        }
        dispatch(setCodeStatus("pressed-run"));
        setTimeout(() => {
          dispatch(setCodeStatus("idle"));
        }, 600);
      }}
      className="content-controls"
    >
      Run
    </Button>
  );
};

export default RunButton;
