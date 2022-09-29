import CloseButton from "./CloseButton";
import MaximizeButton from "./MaximizeButton";
import MinimizeButton from "./MinimizeButton";
const Appbar = () => {
  return (
    <div className="appbar">
      <div className="app-controls">
        <MinimizeButton />
        <MaximizeButton />
        <CloseButton />
      </div>
    </div>
  );
};

export default Appbar;
