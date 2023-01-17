import { IconSearch } from "@tabler/icons";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import clsx from "clsx";
import useSWR from "swr";
import { Suggestions } from "@/components/Suggestions";
import { SearchResult } from "@/components/SearchResult";
import styles from "./SearchInput.module.css";

const fetcher = (...args) => fetch(...args).then((res) => res.json());

export const SearchInput = ({ onSearch, showingResult }) => {
  const [loadingText, setLoadingText] = useState("Analyzing question...");
  const [value, setValue] = useState("");
  const [query, setQuery] = useState("");
  const [showSuggestion, setShowSuggestion] = useState(false);
  const { data, isLoading, error } = useSWR(`/api/search?q=${query}`, fetcher, {
    revalidateOnFocus: false,
    revalidateOnReconnect: false,
    shouldRetryOnError: false,
    revalidateOnMount: false,
    onLoadingSlow() {
      setLoadingText("Calculating and summarizing...");
    },
  });

  const handleKeyDown = async (e) => {
    if (e.key !== "Enter") {
      return;
    }

    onSearch();

    if (!value) return;

    setQuery(value);
  };

  useEffect(() => {
    if (showingResult) {
      setTimeout(() => {
        setShowSuggestion(true);
      }, 400);
    } else {
      setShowSuggestion(false);
    }
  }, [showingResult]);

  return (
    <motion.div
      className={clsx(styles.wrapper, showingResult && styles.withResult)}
    >
      <div
        className={clsx(
          styles.inputWrapper,
          showingResult && styles.withResult
        )}
      >
        <IconSearch className={styles.icon} />
        <input
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onKeyDown={handleKeyDown}
          type="text"
          className={styles.input}
          placeholder={"Ask anything..."}
        />

        <SearchResult
          isLoading={isLoading}
          loadingText={loadingText}
          result={data}
          error={error}
        />
      </div>

      {showSuggestion && <Suggestions showingResult={showingResult} />}
    </motion.div>
  );
};
