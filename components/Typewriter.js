import { Text } from "@mantine/core";
import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useRef, useState } from "react";

const suffix = "......";

export const Typewriter = ({ content, ellipsis }) => {
  if (ellipsis) {
    content = content + suffix;
  }

  const [index, setIndex] = useState(0);
  const intervalRef = useRef(60);

  useEffect(() => {
    intervalRef.current = 60;
    setIndex(0);
    let id = 0;

    function sleep(ms) {
      return new Promise((resolve) => {
        id = setTimeout(resolve, ms);
      });
    }

    async function next() {
      await sleep(intervalRef.current);
      setIndex((i) => {
        let next = i + 1;

        const originalContentLength = content.length - suffix.length;
        intervalRef.current = i >= originalContentLength ? 300 : 60;

        if (i >= content.length) {
          next = originalContentLength;
        }

        return next;
      });
      await next();
    }

    next();

    return () => {
      clearTimeout(id);
    };
  }, [content]);

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        <Text color="dark.3">{content.slice(0, index)}</Text>
      </motion.div>
    </AnimatePresence>
  );
};
