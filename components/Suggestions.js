import clsx from "clsx";
import { createStyles, LoadingOverlay } from "@mantine/core";
import useSWR from 'swr'
import { useRouter } from "next/router"
import { useState } from 'react'


const useStyles = createStyles(() => ({
  root: {
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
    color: '#666666',
    marginTop: 12,
  },
  result: {
    position: 'relative',
    minHeight: 200,
  },
  title: {
    color: '#333333',
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
  card: {
    cursor: "pointer",
    padding: 4,

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
  badge: {
    marginLeft: 4,
  },
}));

export const Suggestions = ({ showingResult, className, onSelect }) => {
  const { classes } = useStyles();
  const router = useRouter()
  const [loadingText, setLoadingText] = useState('Loading suggestions based on your dataset...')
  const id = router.query.id
  const fetcher = (url) => fetch(url, {
    method: 'POST',
    body: JSON.stringify({
      cluster_id: process.env.TIDBCLOUD_CLUSTER_ID,
      database: `${router.query.id}`,
      question_num: 3,
    }),
    headers: {
      'Content-Type': 'application/json',
      'api-key': process.env.TIDBCLOUD_API_KEY,
    },
  }).then((res) => res.json());
  const { data, isLoading, error } = useSWR(id ? `/api/suggest?id=${id}` : null,
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
  })
  console.log(`isLoading=${isLoading}`)
  return (
    <div className={classes.root}>
      <div className={classes.container}>
        <div className={classes.title}>Questions</div>
        {isLoading && <div className={classes.hint}>{loadingText}</div>}
        <div
          className={clsx(classes.result,
            showingResult ? classes.withResult : classes.loadingBlock,
            className
          )}
        >
          <LoadingOverlay visible={isLoading} overlayBlur={2} />
          {data?.questions?.map((v) => (
            <a
              key={v.question_id}
              className={classes.card}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => onSelect?.(v.question)}
            >
              <div>{v.question}</div>
            </a>
          ))}
        </div>
      </div>
    </div>
  );
};
