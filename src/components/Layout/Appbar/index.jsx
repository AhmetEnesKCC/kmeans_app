import AppMenu from "./Menu";
import CloseButton from "./CloseButton";
import MaximizeButton from "./MaximizeButton";
import MinimizeButton from "./MinimizeButton";
import { openModal } from "@mantine/modals";
import Check from "../../check";
import About from "../../about";
import Notes from "../../notes";
import {
  Box,
  Button,
  Group,
  SegmentedControl,
  Switch,
  Text,
} from "@mantine/core";
import PageBox from "../PageBox";
import { setTheme } from "../../../redux/uiSlice";
import { BsMoon, BsSun } from "react-icons/bs";
import { useDispatch, useSelector } from "react-redux";
import { useTranslation } from "react-i18next";
import { useViewportSize } from "@mantine/hooks";

const { ipcRenderer } = window.require("electron");

const Appbar = () => {
  const theme = useSelector((state) => state.ui.theme);

  const dispatch = useDispatch();

  const { i18n, t } = useTranslation();

  const appMenuDropdown = [
    {
      label: t("test dependencies"),
      click: () => {
        ipcRenderer.send("menu:test");
        openModal({
          title: "Testing Dependencies",
          children: <Check />,
          onClose: () => {
            ipcRenderer.send("check:abort");
          },
        });
      },
    },
    {
      label: t("about app"),
      click: () => {
        ipcRenderer.send("menu:about");
        openModal({
          title: "About App",
          children: <About />,
        });
      },
    },
    {
      label: t("version notes"),
      click: () => {
        ipcRenderer.send("menu:version");
        openModal({
          title: "Version Notes",
          children: <Notes />,
          overflow: "inside",
        });
      },
    },
    { type: "divider" },
    {
      label: t("open in github"),
      click: () => {
        ipcRenderer.send("menu:github");
      },
    },
  ];

  const { width } = useViewportSize();

  return (
    <Box
      component={PageBox}
      style={{
        "-webkit-app-region": "drag",
      }}
    >
      <Group position="apart" p={3}>
        <Group>
          <AppMenu target={t("help")} dropdown={appMenuDropdown} />
          <Box sx={{ display: width > 600 ? "block" : "hidden" }}>
            <Text>Kmeans GUI</Text>
          </Box>
          <Group noWrap>
            <Switch
              style={{
                "-webkit-app-region": "no-drag",
              }}
              onChange={(e) => {
                ipcRenderer.send("save-storage", {
                  key: "app-settings.theme",
                  value: theme === "dark" ? "light" : "dark",
                });
                dispatch(setTheme(theme === "dark" ? "light" : "dark"));
              }}
              checked={theme === "dark"}
              size="md"
              color={theme === "dark" ? "gray" : "dark"}
              onLabel={<BsSun size={16} stroke={2.5} color={"yellow.4"} />}
              offLabel={<BsMoon size={16} stroke={2.5} color={"blue.6"} />}
            />
            <SegmentedControl
              style={{
                "-webkit-app-region": "no-drag",
              }}
              value={i18n.language}
              onChange={(v) => {
                ipcRenderer.send("save-storage", {
                  key: "app-settings.language",
                  value: v,
                });
                i18n.changeLanguage(v);
              }}
              data={[
                { label: "EN", value: "en" },
                { label: "TR", value: "tr" },
              ]}
            />
          </Group>
        </Group>
        <Button.Group>
          <MinimizeButton />
          <MaximizeButton />
          <CloseButton />
        </Button.Group>
      </Group>
    </Box>
  );
};

export default Appbar;
