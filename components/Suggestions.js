import { IconArrowRight } from "@tabler/icons";
import clsx from "clsx";
import { createStyles } from "@mantine/core";
import { config } from "@/config";

const useStyles = createStyles(() => ({
  root: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    flex: 0,

    "@media (max-width: 700px)": {
      flexDirection: "column",
    },
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
    padding: 12,

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
  return (
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
          <p>{v.content}</p>
        </a>
      ))}
    </div>
  );
};
