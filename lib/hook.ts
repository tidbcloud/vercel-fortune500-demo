import { useCallback, useEffect, useRef, useState } from "react";

export function useFullScreen() {
  useEffect(() => {
    function setHeight() {
      const el = document.querySelector(".main") as HTMLDivElement;
      if (el) {
        el.style.minHeight = window.innerHeight + "px";
      }
    }
    const deviceWidth = window.matchMedia("(max-width: 700px)");
    if (deviceWidth.matches) {
      window.addEventListener("resize", setHeight);
      setHeight();
    }
  }, []);
}

interface UseSpeechRecognitionProps {
  onError?: (e: SpeechRecognitionErrorEvent) => void;
  onSuccess?: (e: SpeechRecognitionEvent) => void;
  onNoMatch?: (e: SpeechRecognitionEvent) => void;
}

export function useSpeechRecognition({
  onError,
  onSuccess,
  onNoMatch,
}: UseSpeechRecognitionProps) {
  const recognitionRef = useRef<SpeechRecognition>();
  const [recording, setRecording] = useState(false);
  const [error, setError] = useState<SpeechRecognitionErrorCode>();
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
