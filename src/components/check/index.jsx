import { Badge, Box, Button, Group, Loader, Stack, Text } from "@mantine/core";
import { showNotification } from "@mantine/notifications";
import { useCallback } from "react";
import { useEffect, useState } from "react";
import { AiFillExperiment, AiOutlineCheck } from "react-icons/ai";
import { ClipLoader } from "react-spinners";
import "./check.css";

const { ipcRenderer } = window.require("electron");

const Check = () => {
  const [checks, setChecks] = useState([]);

  const [fail, setFail] = useState(false);

  const [end, setEnd] = useState(false);

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

    ipcRenderer.on("check-success", () => {
      setEnd(true);
      showNotification({
        message: "Test Success. You can use the app",
        icon: <AiOutlineCheck />,
        color: "green",
      });
    });

    ipcRenderer.on("check-fail", () => {
      setEnd(true);
      showNotification({
        message: "Test fail. You need to install dependencies.",
        icon: <AiOutlineCheck />,
        color: "red",
      });
      setFail(true);
    });
  }, []);

  return (
    <div className="check-wrapper">
      {!end && (
        <Group>
          Testing <Loader />
        </Group>
      )}
      <div className="checks">
        {checks.map((c) => {
          return (
            <div className="check" key={c.id}>
              <span>{c.label}</span>
              {c.status === "start" && <ClipLoader color="white" />}
              {c.status === "success" && <Badge color="green">Success</Badge>}
              {c.status === "fail" && <Badge color={"red"}>Fail</Badge>}
            </div>
          );
        })}
        {fail && (
          <Stack spacing={"xs"} align="center">
            <Button
              color={"orange"}
              variant="light"
              size="md"
              sx={{ width: "max-content" }}
              leftIcon={<AiFillExperiment />}
            >
              Fix Issues
            </Button>
            <Text size={12}>Expreimental</Text>
          </Stack>
        )}
      </div>
    </div>
  );
};

export default Check;
