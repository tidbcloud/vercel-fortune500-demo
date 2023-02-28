import clsx from "clsx";
import { createStyles, LoadingOverlay, Alert, Badge } from "@mantine/core";
import { IconAlertCircle } from '@tabler/icons'
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
    marginBottom: 12,
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
    background: '#DEDEDE',
  },
  withResult: {
    flexDirection: "column",
    alignSelf: "flex-start",
    minWidth: 280,

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
  badge: {
    marginLeft: 4,
  },
  questionText: {
    marginBottom: 12,
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

  const { data, isLoading, error } = useSWR(
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
    <div className={classes.root}>
      <div className={classes.container}>
        <div className={classes.title}>Questions</div>
        {isLoading && <div className={classes.hint}>{loadingText}</div>}
        {error && <Alert title="Ooops, error occurred" icon={<IconAlertCircle size={16} />} color="red">Failed to load suggestions: {error.message}</Alert>}
        <div
          className={clsx(classes.result,
            showingResult && classes.withResult,
            isLoading && classes.loadingBlock,
            className
          )}
        >
          <LoadingOverlay visible={isLoading} overlayBlur={2} />
          {data?.questions?.map((v) => (
            <a
              key={v.question_id}
              className={classes.question}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => onSelect?.(v.question)}
            >
              <div className={classes.questionText}>{v.question} <Badge className={classes.badge}>{v.question_keyword}</Badge></div>
            </a>
          ))}
        </div>
      </div>
    </div>
  );
};
