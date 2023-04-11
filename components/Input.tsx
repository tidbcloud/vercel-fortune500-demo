import { IconSearch, IconSend, IconMicrophone } from "@tabler/icons";
import {
  createStyles,
  Input as MantineInput,
  Group,
  Loader,
} from "@mantine/core";
import clsx from "clsx";
import { KeyboardEvent, useEffect, useState } from "react";
import { useSpeechRecognition } from "@/lib/hook";

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
  icon: {
    cursor: "pointer",
    color: theme.colors.dark[3],
  },
}));

export const Input: React.FC<{
  value: string;
  onConfirm: (val: string) => void;
  className?: string;
}> = ({ onConfirm, value: _value, className }) => {
  const { classes } = useStyles();
  const [value, setValue] = useState(_value ?? "");
  const { start, data, isLoading } = useSpeechRecognition({
    onError(e) {
      switch (e.error) {
        case "network":
          alert("There is a problem related to network connectivity");
          break;
        case "not-allowed":
          alert("Please allow the browser to use your microphone");
          break;
        default:
          alert(e.error);
      }
    },
  });

  const handleKeyDown = async (e: KeyboardEvent) => {
    if (e.key === "Enter" && value) {
      onConfirm?.(value);
    }
  };

  useEffect(() => {
    setValue(_value);
    onConfirm(_value);
  }, [_value, onConfirm]);

  useEffect(() => {
    if (data) {
      setValue(data);
      onConfirm(data);
    }
  }, [data]);

  return (
    <div className={clsx(classes.root, className)}>
      <MantineInput
        size="xl"
        radius="xl"
        value={value}
        onFocus={(e) => e.target.select()}
        onChange={(e) => setValue(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder={"Ask anything..."}
        icon={<IconSearch />}
        rightSectionWidth={120}
        rightSection={
          <Group>
            {isLoading ? (
              <Loader size={24} color="gray" />
            ) : (
              <IconMicrophone
                className={classes.icon}
                onClick={() => {
                  start();
                }}
              />
            )}
            <IconSend
              className={classes.icon}
              onClick={() => {
                onConfirm?.(value);
              }}
            />
          </Group>
        }
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
