import { IconSearch, IconSend, IconMicrophone } from "@tabler/icons";
import {
  createStyles,
  Input as MantineInput,
  Group,
  Loader,
} from "@mantine/core";
import clsx from "clsx";
import { useCallback, useEffect, useState, useRef } from "react";

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

export const Input = ({ onConfirm, value: _value, className }) => {
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

  const handleKeyDown = async (e) => {
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

function useSpeechRecognition({ onError, onSuccess, onNoMatch }) {
  const recognitionRef = useRef();
  const [recording, setRecording] = useState(false);
  const [error, setError] = useState();
  const [noMatch, setNoMatch] = useState(false);
  const [result, setResult] = useState("");

  const start = useCallback(() => {
    if (!recognitionRef.current) {
      alert(
        "Your browser is not supporting voice recognition, try with a modern browser like Chrome."
      );
      return;
    }
    recognitionRef.current.start();

    setRecording(true);
    setError(undefined);
    setNoMatch(false);
    setResult("");
  }, []);

  useEffect(() => {
    // https://developer.mozilla.org/en-US/docs/Web/API/SpeechRecognition
    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      return;
    }
    const recognition = new SpeechRecognition();

    recognition.continuous = false;
    recognition.lang = "en-US";
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;

    recognitionRef.current = recognition;

    recognition.onspeechend = function () {
      recognition.stop();
      setRecording(false);
    };
    recognition.onnomatch = function (event) {
      setNoMatch(true);
      setRecording(false);

      onNoMatch?.(event);
    };
    recognition.onerror = function (event) {
      setError(event.error);
      setRecording(false);

      onError?.(event);
    };
    recognition.onresult = function (event) {
      setResult(event.results[0][0].transcript);
      setRecording(false);

      onSuccess?.(event);
    };
  }, []);

  return {
    start,
    isLoading: recording,
    error,
    noMatch,
    data: result,
  };
}
