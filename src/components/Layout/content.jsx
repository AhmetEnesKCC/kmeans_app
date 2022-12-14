import { Box, Container, createStyles, Stack, Text } from "@mantine/core";
import _ from "lodash";
import { useLocation } from "react-router-dom";

const Content = ({ children }) => {
  return (
    <Stack
      sx={{
        flex: 1,
      }}
    >
      {children}
    </Stack>
  );
};

export default Content;
