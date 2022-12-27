import React, { useEffect, useState } from "react";

import { useDispatch, useSelector } from "react-redux";

import { Badge, Group, Stack, Table, Text } from "@mantine/core";
import PageBox from "../components/Layout/PageBox";
import { FaProjectDiagram } from "react-icons/fa";
import { FiSettings } from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import { AiOutlineCode } from "react-icons/ai";
import { useTranslation } from "react-i18next";
const { ipcRenderer } = window.require("electron");

const IndexPage = () => {
  const { t } = useTranslation();
  useEffect(() => {
    ipcRenderer.on("log-from-main", (e, data) => {
      console.log(data);
    });
  }, []);

  const keyChanger = {
    word: t("term"),
    definition: t("definition"),
  };

  const definitions = [
    { word: "LabelWOExt", definition: "Dosyanın uzantısız ismi" },
    { word: "Loop", definition: "KMeans deki iterasyon sayısı" },
    { word: "Path", definition: "Dosyanın Yolu" },
    { word: "Flow Builder", definition: "Akış Oluşturma Motoru" },
    {
      word: "Test Dependencies",
      definition:
        "Programın çalışması için gerekli bağımlılıkları test etme bölümü.",
    },
    {
      word: "OUTPUT:PRINT",
      definition:
        "Akış Çalışması sonunda çıkan output içerisinde python kodlarından gelen printlerin gösterildiği bölüm",
    },
  ];

  return (
    <Stack sx={{ width: "100%", height: "100%" }}>
      <Stack p={10} component={PageBox}>
        <Text transform="capitalize" sx={{ width: "max-content" }} p={2}>
          {t("pages")}
        </Text>
        <Group
          spacing={32}
          sx={{
            borderRadius: 20,
          }}
        >
          <SuperBox
            title={t("flow builder")}
            icon={<FaProjectDiagram size={20} />}
            color="green"
            hoverColorIndex={5}
            colorIndex={4}
            text={"white"}
            to="/flow-builder"
          />
          <SuperBox
            title={t("settings")}
            icon={<FiSettings size={20} />}
            color="blue"
            hoverColorIndex={5}
            colorIndex={4}
            text={"white"}
            to="/settings"
          />
          <SuperBox
            title={t("edit code")}
            icon={<AiOutlineCode size={20} />}
            color="orange"
            hoverColorIndex={5}
            colorIndex={6}
            text={"white"}
            // to="/edit-code"
            soon
          />
        </Group>
      </Stack>
      {/* <Stack
        sx=
        {{
          overflow: "auto",
        }}
        p={10}
        component={PageBox}>
        <Text sx={{ width: "max-content" }} p={2}>
          {t("dictionary")}
        </Text>
        <Table striped withBorder withColumnBorders>
          <thead>
            {Object.keys(definitions[0]).map((key) => (
              <th>{keyChanger[key]}</th>
            ))}
          </thead>
          <tbody>
            {definitions.map((d) => (
              <tr>
                <td>{d.word}</td>
                <td>{d.definition}</td>
              </tr>
            ))}
          </tbody>
        </Table>
      </Stack> */}
    </Stack>
  );
};

const SuperBox = ({ children, ...props }) => {
  const navigate = useNavigate();
  return (
    <Stack
      onClick={() => {
        props.to && navigate(props.to);
      }}
      align={"start"}
      justify="start"
      spacing={10}
      p={8}
      pr={20}
      sx={(theme) => ({
        backgroundColor: theme.colors?.[props.color]?.[props.colorIndex],
        color: props.text,
        height: 100,
        borderRadius: 10,
        cursor: props.to && "pointer",
        "&:hover": {
          backgroundColor: theme.colors?.[props.color]?.[props.hoverColorIndex],
        },
      })}
      {...props}
    >
      <Text sx={{ color: props.text }}>{props.title}</Text>
      {props.icon && props.icon}
      {props.soon && <Badge color={"orange"}>Yakında</Badge>}
    </Stack>
  );
};

export default IndexPage;
