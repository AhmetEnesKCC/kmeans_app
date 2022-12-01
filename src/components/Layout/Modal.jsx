import { Modal } from "@mantine/core";
import { useEffect } from "react";
import { useState } from "react";

const AppModal = ({ children }) => {
  const { opened, setOpened } = useState(false);

  useEffect(() => {}, []);

  return (
    <>
      <Modal opened={opened}>{children}</Modal>
    </>
  );
};

export default AppModal;
