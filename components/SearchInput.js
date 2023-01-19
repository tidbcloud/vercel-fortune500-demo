import { IconSearch } from "@tabler/icons";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import clsx from "clsx";
import useSWR from "swr";
import { SearchResult } from "@/components/SearchResult";
import styles from "./SearchInput.module.css";
import { Logo } from "@/components/Logo";
import { DatasetSelect } from "@/components/DatasetSelect";

const fetcher = (...args) => fetch(...args).then((res) => res.json());

export const SearchInput = ({ onSearch, showingResult, searchValue }) => {
  const [loadingText, setLoadingText] = useState("Analyzing question");
  const [value, setValue] = useState("");
  const [query, setQuery] = useState("");

  const { data, isLoading, error } = useSWR(
    () => (query ? `/api/search?q=${query}` : null),
    fetcher,
    {
      revalidateOnFocus: false,
      revalidateOnReconnect: false,
      shouldRetryOnError: false,
      onSuccess() {
        setLoadingText("Analyzing question");
      },
      onLoadingSlow() {
        setLoadingText("Calculating and summarizing");
      },
    }
  );

  useEffect(() => {
    setValue(searchValue);
    setQuery(searchValue);
  }, [searchValue]);

  const handleKeyDown = async (e) => {
    if (e.key === "Enter" && value) {
      onSearch(value);
    }
  };

  const handleClickIcon = () => {
    onSearch(value);
    setQuery(value);
  };

  const enterIcon = (
    <svg
      className={styles.enterIcon}
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      onClick={handleClickIcon}
    >
      <path
        d="M20 4V5.4C20 8.76031 20 10.4405 19.346 11.7239C18.7708 12.8529 17.8529 13.7708 16.7239 14.346C15.4405 15 13.7603 15 10.4 15H4M4 15L9 10M4 15L9 20"
        stroke="black"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );

  return (
    <motion.div
      className={clsx(styles.wrapper, showingResult && styles.withResult)}
    >
      <div className={styles.content}>
        <motion.div layout onClick={() => onSearch("")}>
          <p className={styles.slogan}>
            <Logo />
            <span>SmartChart - Instant Data Exploration</span>
          </p>
        </motion.div>

        <motion.div
          layout
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
          {enterIcon}
        </motion.div>

        {!showingResult && <DatasetSelect />}

        <SearchResult
          isLoading={isLoading}
          loadingText={loadingText}
          result={data}
          error={error}
        />
      </div>
    </motion.div>
  );
};
