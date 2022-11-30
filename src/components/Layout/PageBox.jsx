import { Box } from "@mantine/core";

const PageBox = ({ children, sx, ...props }) => {
  return (
    <Box
      sx={(theme) => ({
        backgroundColor: theme.colorScheme === "dark" ? "#212121" : "white",
        ...sx,
      })}
      {...props}
    >
      {children}
    </Box>
  );
};

export default PageBox;
