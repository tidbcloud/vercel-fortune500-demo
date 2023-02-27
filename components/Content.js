import { useCallback, useState } from "react";
import { motion } from "framer-motion";
import useSWR from "swr";
import { useRouter } from "next/router";
import { createStyles } from "@mantine/core";
import { SearchResult } from "@/components/SearchResult";
import { BrandSection } from "@/components/BrandSection";
import { Input } from "@/components/Input";
import { fetcher } from "@/lib/fetch";

const useStyles = createStyles({
  content: {
    maxWidth: 1200,
    width: "100%",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
  },
  input: {
    width: "100%",
    display: "flex",
    justifyContent: "center",
  },
  result: {
    width: "100%",
  },
});

export const Content = ({ onSearch, searchValue }) => {
  const { classes } = useStyles();
  const [loadingText, setLoadingText] = useState("Analyzing question");
  const [query, setQuery] = useState("");
  const router = useRouter();
  const id = router.query.id;

  const { data, isLoading, error } = useSWR(
    query ? `/api/search?q=${query}${id ? `&id=${id}` : ""}` : null,
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

  const onConfirm = useCallback(
    (val) => {
      setQuery(val);
      onSearch(val);
    },
    [onSearch]
  );

  return (
    <div className={classes.content}>
      <motion.div layout>
        <BrandSection onClick={() => onSearch("")} />
      </motion.div>

      <motion.div layout className={classes.input}>
        <Input onConfirm={onConfirm} value={searchValue} />
      </motion.div>

      <SearchResult
        className={classes.result}
        isLoading={isLoading}
        loadingText={loadingText}
        result={data}
        error={error}
      />
    </div>
  );
};
