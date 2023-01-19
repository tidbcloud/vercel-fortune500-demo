import { IconSearch, IconSend } from "@tabler/icons";
import { createStyles, Input as MantineInput } from "@mantine/core";
import clsx from "clsx";
import { useEffect, useState } from "react";

const useStyles = createStyles((theme) => ({
  root: {
    position: "relative",
    alignSelf: "center",
    width: "100%",
    maxWidth: 768,
    flexBasis: "100%",
  },
  withResult: {
    alignSelf: "flex-start",
  },
  sendIcon: {
    cursor: "pointer",
    color: theme.colors.dark[3],
  },
}));

export const Input = ({ onConfirm, value: _value, className }) => {
  const { classes } = useStyles();
  const [value, setValue] = useState(_value ?? "");

  const handleKeyDown = async (e) => {
    if (e.key === "Enter" && value) {
      onConfirm?.(value);
    }
  };

  useEffect(() => {
    setValue(_value);
    onConfirm(_value);
  }, [_value]);

  return (
    <div className={clsx(classes.root, className)}>
      <MantineInput
        size="xl"
        radius="xl"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder={"Ask anything..."}
        icon={<IconSearch />}
        rightSectionWidth={80}
        rightSectionProps={{
          onClick: () => {
            onConfirm?.(value);
          },
        }}
        rightSection={<IconSend className={classes.sendIcon} />}
        styles={(theme) => ({
          input: {
            fontSize: 16,
            color: theme.colors.dark[4],
            "&:focus": {
              borderColor: theme.colors.gray[5],
            },
          },
        })}
      />
    </div>
  );
};
