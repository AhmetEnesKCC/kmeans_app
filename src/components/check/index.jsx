import { useCallback } from "react";
import { useEffect, useState } from "react";
import { ClipLoader } from "react-spinners";
import "./check.css";

const { ipcRenderer } = window.require("electron");

const Check = () => {
  const [checks, setChecks] = useState([]);

  useEffect(() => {
    ipcRenderer.send("get-checks");

    ipcRenderer.on("check-start", (e, check) => {
      setChecks((prevChecks) => [...prevChecks, check]);
    });

    ipcRenderer.on("check-end", (e, check) => {
      const newChecks = checks.map((c) => {
        if (c.id === check.id) {
          c.status = check.status;
        }
        return c;
      });
      setChecks((prevChecks) => {
        return prevChecks.map((c) => {
          if (c.id === check.id) {
            c.status = check.status;
          }
          return c;
        });
      });
    });
  }, []);

  return (
    <div className="check-wrapper">
      <h3>Checking Something</h3>
      <div className="checks">
        {checks.map((c) => {
          return (
            <div className="check" key={c.id}>
              <span>{c.label}</span>
              {c.status === "start" && <ClipLoader color="white" />}
              {c.status === "success" && "✅"}
              {c.status === "fail" && "❌"}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Check;
