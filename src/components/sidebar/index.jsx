import { useState } from "react";
import { useEffect } from "react";
import Treeview from "./Treeview";

import { useSelector } from "react-redux";
import Settings from "./Settings";
import ResizableArea from "../ResizableArea";
import {
  ActionIcon,
  Center,
  createStyles,
  Image,
  Navbar,
  Stack,
  Tooltip,
} from "@mantine/core";
import { FaProjectDiagram } from "react-icons/fa";
import { BsFiles } from "react-icons/bs";
import { FiSettings } from "react-icons/fi";
import { Link } from "react-router-dom";

const Sidebar = () => {
  const menubar = useSelector((state) => state.menubar);

  const links = [
    { label: "Flow Builder", link: "flow-builder", icon: FaProjectDiagram },
  ];

  const bottomLinks = [
    { label: "Settings", link: "settings", icon: FiSettings },
  ];

  return (
    <Navbar width={{ base: 80 }} sx={{ height: "100%" }}>
      <Link to={"/"}>
        <Center>
          <Image src={"/assets/icons/icon.png"} width={80} />
        </Center>
      </Link>
      <Stack sx={{ flex: 1, height: "100%" }} justify="space-between">
        <Navbar.Section grow mt={20}>
          <NavbarLinkStack links={links} />
        </Navbar.Section>
        <Navbar.Section>
          <NavbarLinkStack links={bottomLinks} />
        </Navbar.Section>
      </Stack>
    </Navbar>
  );
};

const NavbarLinkStack = ({ links }) => {
  return (
    <Stack p="md" align={"center"} spacing={20}>
      {links.map(({ icon: Icon, label, link }) => (
        <Tooltip
          label={label}
          position="right"
          transitionDuration={0}
          color={"gray"}
        >
          <Link to={link}>
            <ActionIcon p={10} sx={{ width: 40, height: 40 }}>
              <Icon size={30} />
            </ActionIcon>
          </Link>
        </Tooltip>
      ))}
    </Stack>
  );
};

export default Sidebar;
