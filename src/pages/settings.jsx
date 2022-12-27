import {
  Box,
  Button,
  Container,
  createStyles,
  Group,
  Input,
  NumberInput,
  Stack,
  Text,
} from "@mantine/core";
import { showNotification } from "@mantine/notifications";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import { setSettings } from "../redux/settingsSlice";
import PageBox from "../components/Layout/PageBox";
import { resetArguments, setArguments, setLoop } from "../redux/argumentSlice";
import { useTranslation } from "react-i18next";

const { ipcRenderer } = window.require("electron");

const Settings = () => {
  const dispatch = useDispatch();

  const handleSelectFolder = (inputName) => {
    ipcRenderer.send("open:dialog:folder", inputName);
  };

  useEffect(() => {
    ipcRenderer.on("folder:path", (e, { inputName, result }) => {
      setValue(inputName, result);
    });
  }, []);

  const [localLoop, setLocalLoop] = useState(100);

  const { handleSubmit, getValues, setValue, register } = useForm({
    defaultValues: {
      algo: "",
      data: "",
      loop: 100,
    },
  });

  useEffect(() => {
    ipcRenderer.send("get-app-settings");
    ipcRenderer.on("settings-send", (e, settings) => {
      if (settings) {
        settings["algo"] && setValue("algo", settings["algo"]);
        settings["data"] && setValue("data", settings["data"]);
        setLocalLoop(settings.loop);
      }
    });
  }, []);

  const styles = createStyles({
    inputWrapper: {
      flex: 1,
      "& input": {
        marginTop: 10,
      },
    },
  });

  const { classes } = styles();

  const { t } = useTranslation();
  return (
    <Box>
      <form
        onSubmit={handleSubmit((val) => {
          if (!Object.values(getValues()).every((el) => el) && localLoop > 0) {
            showNotification({
              message: "Please fill all provided inputs",
              color: "red",
            });
            return;
          }
          dispatch(resetArguments());
          dispatch(setSettings(getValues()));
          dispatch(setLoop(localLoop));
          ipcRenderer.send("save-storage", {
            key: "app-settings",
            value: getValues(),
          });
          showNotification({
            message: "Saved successfully",
            color: "green",
          });
        })}
      >
        <Stack component={PageBox} spacing={30} p={10}>
          <NumberInput
            label={t("loop")}
            placeholder="Loop Girin"
            value={localLoop}
            onChange={(value) => {
              setValue("loop", value);
              setLocalLoop(value);
            }}
          />
          <Group noWrap align={"end"}>
            <Input.Wrapper
              className={classes.inputWrapper}
              label={t("algorithms")}
            >
              <Input
                onClick={() => {
                  handleSelectFolder("algo");
                }}
                readOnly
                placeholder="Klasör Seç"
                {...register("algo")}
              />
            </Input.Wrapper>
            <Button
              onClick={() => {
                handleSelectFolder("algo");
              }}
            >
              {t("browse-folder")}
            </Button>
          </Group>
          <Group noWrap align={"end"}>
            <Input.Wrapper
              className={classes.inputWrapper}
              label={t("datasets")}
            >
              <Input
                onClick={() => {
                  handleSelectFolder("data");
                }}
                readOnly
                placeholder="Klasör Seç"
                {...register("data")}
              />
            </Input.Wrapper>
            <Button
              onClick={() => {
                handleSelectFolder("data");
              }}
            >
              {t("browse-folder")}
            </Button>
          </Group>{" "}
          <Button
            size="md"
            type="submit"
            gradient={{
              from: "green.6",
              to: "blue.6",
            }}
            px={50}
            sx={(theme) => ({
              color: theme.colors.white,
              width: "max-content",
              textTransform: "capitalize",
            })}
            variant="gradient"
          >
            {t("apply")}
          </Button>
        </Stack>
      </form>
    </Box>
  );
};

export default Settings;
