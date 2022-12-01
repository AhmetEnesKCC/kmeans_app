import { Badge, Divider, List, Stack, Text } from "@mantine/core";

const labelSwitch = {
  fix: "blue",
  feature: "green",
  note: "orange",
  next: "lime",
};

const Note = ({ version, texts }) => {
  return (
    <Stack spacing={20}>
      <Text variant="h4" weight={"bold"} size={20}>
        v{version}
      </Text>
      {texts.map((t) => {
        return (
          <Stack align={"start"}>
            <Badge color={labelSwitch[t.label]}>{t.label}</Badge>
            <List listStyleType="disc">
              {t.lines.map((tl) => (
                <List.Item>{tl}</List.Item>
              ))}
            </List>
          </Stack>
        );
      })}
    </Stack>
  );
};

const Notes = () => {
  const notes = [
    {
      version: "0.1.17",
      texts: [
        {
          label: "feature",
          lines: ["Added help menu", "Added testing for dependencies"],
        },
        {
          label: "next",
          lines: ["Fixing not installed dependencies from the GUI"],
        },
      ],
    },
    {
      version: "0.1.16",
      texts: [
        {
          label: "fix",
          lines: ["An issue that prevents to open app in windows"],
        },
      ],
    },
  ];

  return (
    <Stack spacing={60}>
      {notes.map((n, i) => (
        <>
          <Note {...n} />
          {i !== notes.length - 1 && <Divider />}
        </>
      ))}
    </Stack>
  );
};

export default Notes;
