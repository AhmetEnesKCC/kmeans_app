import React, { useEffect, useState } from "react";
import { useDrop } from "react-dnd";
import DragArea from "../components/index/DragArea";
import ContentInfo from "../components/index/ContentInfo";

import { useDispatch, useSelector } from "react-redux";
import Output from "../components/index/Output";
import {
  setSelectedAlgos,
  setSelectedDatasets,
  setSelectedNormalizations,
} from "../redux/argumentSlice";
import { RiRouteLine } from "react-icons/ri";
import { AiFillDatabase, AiOutlineCode } from "react-icons/ai";
import { TiWaves } from "react-icons/ti";
import { showNotification } from "@mantine/notifications";
import { Badge, Box, Group, List, Stack, Table, Text } from "@mantine/core";
import PageBox from "../components/Layout/PageBox";
import { FaProjectDiagram } from "react-icons/fa";
import { FiSettings } from "react-icons/fi";
import { useNavigate } from "react-router-dom";
const { ipcRenderer } = window.require("electron");

const IndexPage = () => {
  const dispatch = useDispatch();

  const [data, setData] = useState([]);

  useEffect(() => {
    ipcRenderer.on("log-from-main", (e, data) => {
      console.log(data);
    });
  }, []);
  const codeStatus = useSelector((state) => state.codeStatus);
  const selectedArguments = useSelector((state) => state.selectedArguments);

  const isValid = (obj, keys) => {
    let result = true;
    keys.map((key) => {
      if (obj[key].length === 0) {
        result = false;
      }
      return true;
    });
    return result;
  };

  // useEffect(() => {
  //   if (
  //     codeStatus === "pressed-run" &&
  //     !isValid(selectedArguments, ["algorithms", "normalizations", "datasets"])
  //   )
  //     showNotification({
  //       message:
  //         "You need to select at least 1 algorithm, 1 dataset and 1 normalization technique. Forcing to add a normalization technique will be removed in the one of the next updates.",
  //       color: "red",
  //     });
  // }, [codeStatus, selectedArguments]);

  const keyChanger = {
    word: "Kavram",
    definition: "Tanım",
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
        <Text sx={{ width: "max-content" }} p={2}>
          Sayfalar
        </Text>
        <Group
          spacing={32}
          sx={{
            borderRadius: 20,
          }}
        >
          <SuperBox
            title={"Flow Builder"}
            icon={<FaProjectDiagram size={20} />}
            color="green"
            hoverColorIndex={5}
            colorIndex={4}
            text={"white"}
            to="/flow-builder"
          />
          <SuperBox
            title={"Settings"}
            icon={<FiSettings size={20} />}
            color="blue"
            hoverColorIndex={5}
            colorIndex={4}
            text={"white"}
            to="/settings"
          />
          <SuperBox
            title={"Kod Düzenle"}
            soon
            icon={<AiOutlineCode size={20} />}
            color="orange"
            hoverColorIndex={5}
            colorIndex={6}
            text={"white"}
          />
        </Group>
      </Stack>
      <Stack
        sx={{
          overflow: "auto",
        }}
        p={10}
        component={PageBox}
      >
        <Text sx={{ width: "max-content" }} p={2}>
          Kavram Tanımları
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
      </Stack>
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
