import { BsPlayFill } from "react-icons/bs";
import { AiOutlineStop } from "react-icons/ai";
import { useDispatch, useSelector } from "react-redux";
import { useLocation } from "react-router-dom";
import { setCodeStatus } from "../../../redux/codeStatusSlice";
import { setSummary } from "../../../redux/summarySlice";
import RunButton from "./RunButton";

const { ipcRenderer } = window.require("electron");

const TopBar = () => {
  const location = useLocation();

  const dispatch = useDispatch();

  const codeStatus = useSelector((state) => state.codeStatus);

  const selectedArguments = useSelector((state) => state.selectedArguments);

  const showSummary = useSelector((state) => state.showSummary);

  const handleRun = () => {
    if (location.pathname === "/output") {
      ipcRenderer.send("re-run");
      return;
    }
    if (
      selectedArguments.algorithms.length === 0 ||
      selectedArguments.datasets.length === 0 ||
      selectedArguments.normalizations.length === 0
    ) {
      alert(
        "You need to select at least one dataset, one algorithm and one normalization type."
      );
    } else {
      ipcRenderer.send("run", selectedArguments);
    }
  };

  const handleStop = () => {
    dispatch(setCodeStatus("stop"));
    ipcRenderer.send("stop-code");
  };

  const handleSummary = () => {
    dispatch(setSummary(!showSummary));
  };

  return (
    <div className="topbar">
      <div className="topbar-controls">
        <RunButton />
      </div>
    </div>
  );
};

export default TopBar;
