import {
  Badge,
  Card,
  Divider,
  Group,
  Image,
  MANTINE_COLORS,
  Stack,
  Text,
} from "@mantine/core";
import { AiFillHeart } from "react-icons/ai";

const About = () => {
  return (
    <Stack>
      <Text variant="h6">K-Means GUI</Text>
      <Card>
        <Group
          sx={{ width: "100%", marginBottom: "10px" }}
          align={"center"}
          position="apart"
        >
          <Text variant="h4" weight={"lighter"}>
            v0.2.3
          </Text>
          <Badge color={"orange"}>On Development</Badge>
        </Group>
        <Card.Section>
          <Image height={240} alt="app icon" src={"./assets/logo.png"} />
        </Card.Section>
        <Card.Section>
          <Text variant="p" sx={{ padding: 2 }}>
            Started to developm at 2022. New features will be added.
          </Text>
          <Divider></Divider>
          <Group position="center">
            <Text align="center" sx={{ padding: 2 }}>
              Made with
            </Text>
            <AiFillHeart className="text-red-300" />
          </Group>
        </Card.Section>
      </Card>
    </Stack>
  );
};

export default About;
