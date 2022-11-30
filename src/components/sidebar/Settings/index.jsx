import {
  Box,
  Button,
  Container,
  createStyles,
  Group,
  Input,
  NumberInput,
  Stack,
} from "@mantine/core";
import { showNotification } from "@mantine/notifications";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import { setSettings } from "../../../redux/settingsSlice";
import PageBox from "../../Layout/PageBox";

const { ipcRenderer } = window.require("electron");

const Settings = () => {
  const dispatch = useDispatch();
  const { loop, algo, data, norm } = useSelector((state) => state.settings);

  const handleSelectFolder = (inputName) => {
    ipcRenderer.send("open:dialog:folder", inputName);
  };

  useEffect(() => {
    ipcRenderer.on("folder:path", (e, { inputName, result }) => {
      setValue(inputName, result);
    });
  }, []);

  const { handleSubmit, getValues, setValue, register } = useForm({
    defaultValues: {
      loop,
      algo,
      norm,
      data,
    },
  });

  const styles = createStyles({
    inputWrapper: {
      flex: 1,
      "& input": {
        marginTop: 10,
      },
    },
  });

  const { classes } = styles();

  return (
    <Box>
      <Stack
        component={PageBox}
        onSubmit={handleSubmit((val) => {
          dispatch(setSettings(getValues()));
          showNotification({
            message: "Saved successfully",
            color: "green",
          });
        })}
        spacing={30}
        p={10}
      >
        <NumberInput
          label="Loop"
          placeHolder="Loop Girin"
          value={loop}
          onChange={(value) => {
            setValue("loop", value);
          }}
        />
        <Group noWrap align={"end"}>
          <Input.Wrapper className={classes.inputWrapper} label="Algorithms">
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
            Klasör Seç
          </Button>
        </Group>
        <Group noWrap align={"end"}>
          <Input.Wrapper className={classes.inputWrapper} label="Datasets">
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
            Klasör Seç
          </Button>
        </Group>{" "}
        <Group noWrap align={"end"}>
          <Input.Wrapper
            className={classes.inputWrapper}
            label="Normalizations"
          >
            <Input
              onClick={() => {
                handleSelectFolder("norm");
              }}
              readOnly
              placeholder="Klasör Seç"
              {...register("norm")}
            />
          </Input.Wrapper>
          <Button
            onClick={() => {
              handleSelectFolder("norm");
            }}
          >
            Klasör Seç
          </Button>
        </Group>
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
          })}
          variant="gradient"
        >
          Onayla
        </Button>
      </Stack>
    </Box>
  );
};

// const Input = ({ children, label, type, onChange, ...inputProps }) => {
//   return (
//     <div className="settings-input">
//       <label>{label}</label>
//       <MantineInput
//         onChange={(e) => {
//           onChange?.(e);
//         }}
//         type={type ?? "text"}
//         {...inputProps}
//       />
//     </div>
//   );
// };

export default Settings;
