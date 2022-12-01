import { Box, Container, createStyles, Stack, Text } from "@mantine/core";
import _ from "lodash";
import { useLocation } from "react-router-dom";

const Content = ({ children }) => {
  const routePathName = useLocation()
    .pathname.replace("-", " ")
    .replace("/", "");
  return (
    <Stack
      sx={{
        flex: 1,
      }}
    >
      <Text
        sx={(theme) => ({
          color: theme.colorScheme === "dark" ? "white" : theme.colors.dark,
          opacity: 0.7,
        })}
        component="h3"
        size={18}
        weight="bold"
      >
        {_.capitalize(routePathName === "" ? "home" : routePathName)}
      </Text>
      {children}
    </Stack>
  );
};

export default Content;
