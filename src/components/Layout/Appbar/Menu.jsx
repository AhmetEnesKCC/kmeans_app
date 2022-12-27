const { Menu, Text, createStyles, Button } = require("@mantine/core");

const BarMenu = ({ target, dropdown = [] }) => {
  const styles = createStyles({
    target: {
      "&:hover": {
        backgroundColor: "rgba(255,255,255,0.2)",
      },
    },
  });

  const { classes } = styles();

  return (
    <Menu
      closeOnItemClick={false}
      sx={{ "-webkit-app-region": "no-drag" }}
      classNames={classes}
    >
      <Menu.Target>
        <Button variant="outline" className={classes.target}>
          <Text>{target}</Text>
        </Button>
      </Menu.Target>
      <Menu.Dropdown>
        {dropdown.map((d) =>
          d.type === "divider" ? (
            <Menu.Divider />
          ) : (
            <Menu.Item
              className={classes.link}
              sx={{
                textTransform: "capitalize",
              }}
              onClick={d.click}
            >
              {d.label}
            </Menu.Item>
          )
        )}
        <Menu.Divider />
      </Menu.Dropdown>
    </Menu>
  );
};

export default BarMenu;
