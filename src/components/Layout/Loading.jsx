import { Loader, LoadingOverlay, Stack, Text } from "@mantine/core";
import { useEffect } from "react";
import { useSelector } from "react-redux";

const Loading = () => {
  const { visible, title } = useSelector((state) => state.ui.loading);

  return (
    <LoadingOverlay
      visible={visible}
      loader={<LoadingContent title={title} />}
    />
  );
};

const LoadingContent = ({ title, ...props }) => {
  return (
    <Stack align="center">
      <Loader variant="dots" />
      <Text>{title}</Text>
    </Stack>
  );
};

export default Loading;
