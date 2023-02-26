import clsx from "clsx";
import { createStyles, LoadingOverlay } from "@mantine/core";
import useSWR from "swr";
import { useRouter } from "next/router";
import { useState } from "react";
import { fetcher } from "@/lib/fetch";

const useStyles = createStyles(() => ({
  container: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-between",
    flex: 0,
    "@media (max-width: 700px)": {
      flexDirection: "column",
    },
  },
  hint: {
    color: "#666666",
    marginTop: 12,
  },
  result: {
    position: "relative",
    minHeight: 200,
  },
  title: {
    color: "#333333",
    fontSize: 24,
    marginBottom: 18,
  },
  loadingBlock: {
    width: 600,
  },
  withResult: {
    flexDirection: "column",
    alignSelf: "flex-start",
    minWidth: 280,
    marginTop: 54,

    "@media (max-width: 700px)": {
      marginTop: 0,
    },
  },
  dataset: {
    fontSize: 16,
    gap: 0,
    marginTop: 36,
    justifyContent: "flex-start",
    paddingLeft: 12,
    "& select": {
      fontSize: 16,
    },
    "@media (max-width: 700px)": {
      fontSize: 12,
      gap: 4,

      "& select": {
        fontSize: 12,
      },
    },
  },
  question: {
    cursor: "pointer",
    color: "#666666",

    "& > h2": {
      marginBottom: 8,
      display: "flex",
      alignItems: "center",
      gap: 4,

      "@media (max-width: 700px)": {
        fontSize: 16,
        marginBottom: 0,
      },
    },

    "& > p": {
      opacity: 0.6,
      fontSize: 14,
      lineHeight: 1.5,
    },
  },
}));

export const Suggestions = ({ showingResult, className, onSelect }) => {
  const { classes } = useStyles();
  const router = useRouter();
  const [loadingText, setLoadingText] = useState(
    "Loading suggestions based on your dataset..."
  );
  const id = router.query.id;

  const { data, isLoading } = useSWR(
    id ? `/api/suggest?id=${id}` : null,
    fetcher,
    {
      revalidateOnFocus: false,
      revalidateOnReconnect: false,
      shouldRetryOnError: false,
      onSuccess() {
        setLoadingText("Questions based on your own dataset:");
      },
      onLoadingSlow() {
        setLoadingText("Calculating and summarizing...");
      },
    }
  );

  return (
    <div>
      <div className={classes.title}>Questions</div>
      <div
        className={clsx(
          classes.root,
          showingResult && classes.withResult,
          className
        )}
      >
        {config.suggestions.map((v) => (
          <a
            key={v.content}
            className={classes.card}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => onSelect?.(v.content)}
          >
            <p>{v.content}<Badge>{v.title}</Badge></p>
          </a>
        ))}
      </div>
    </div>
  );
};
