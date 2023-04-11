import clsx from "clsx";
import { createStyles, LoadingOverlay, Alert, Badge } from "@mantine/core";
import { IconAlertCircle } from "@tabler/icons";
import useSWR from "swr";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { fetcher } from "@/lib/fetch";
import type { Chat2questionResponse } from "@/lib/api";

const useStyles = createStyles(() => ({
  root: {
    "@media (max-width: 700px)": {
      width: "100%",
    },
  },
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
    background: "#DEDEDE",
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
  isError: {
    display: "none",
  },
}));

const LOADING_MSGS = [
  "Loading suggestions based on your dataset...",
  "We are calculating and summarizing your dataset...",
  "We are analyzing your dataset...",
  "We are preparing your suggested questions...",
];

export const Suggestions: React.FC<{
  showingResult: boolean;
  className?: string;
  onSelect?: (val: string) => void;
}> = ({ showingResult, className, onSelect }) => {
  const { classes } = useStyles();
  const router = useRouter();
  const [loadingText, setLoadingText] = useState(
    "Calculating your suggested questions..."
  );
  const id = router.query.id;
  const { data, isLoading, error } = useSWR<Chat2questionResponse>(
    id ? `/api/suggest?id=${id}` : null,
    fetcher,
    {
      revalidateOnFocus: false,
      revalidateOnReconnect: false,
      shouldRetryOnError: false,
    }
  );
  useEffect(() => {
    if (isLoading) {
      let i = 0;
      const interval = setInterval(() => {
        setLoadingText(LOADING_MSGS[i++ % LOADING_MSGS.length]);
      }, 3000);
      return () => clearInterval(interval);
    }
  }, [isLoading]);

  const isError = error || (data && data?.code !== 200);

  return (
    <div className={classes.root}>
      <div className={classes.container}>
        <div className={classes.title}>Questions</div>
        {isLoading && <div className={classes.hint}>{loadingText}</div>}
        {isError && (
          <Alert
            title="Ooops, error occurred"
            icon={<IconAlertCircle size={16} />}
            color="red"
          >
            Failed to load suggestions: {error?.message ?? data?.message}
          </Alert>
        )}

        <div
          className={clsx(
            classes.result,
            showingResult && classes.withResult,
            isLoading && classes.loadingBlock,
            isError && classes.isError,
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
              <div className={classes.questionText}>
                {v.question}{" "}
                <Badge className={classes.badge}>{v.question_keyword}</Badge>
              </div>
            </a>
          ))}
        </div>
      </div>
    </div>
  );
};
