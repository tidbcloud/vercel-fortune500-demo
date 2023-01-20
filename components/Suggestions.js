import { IconArrowRight } from "@tabler/icons";
import clsx from "clsx";
import { createStyles } from "@mantine/core";

const data = [
  {
    title: "Distribution",
    content: "What's the country distribution of global 500 companies in 2022?",
  },
  {
    title: "Profit",
    content: "What are the top 10 companies by profit in 2022?",
  },
  {
    title: "Growth",
    content:
      "Which 10 companies had the highest increase by profit from 2018 to 2022?",
  },
  {
    title: "Efficiency",
    content: "Top 10 companies generate the most profit with every employee?",
  },
];

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
      {data.map((v) => (
        <a
          key={v.content}
          className={classes.card}
          target="_blank"
          rel="noopener noreferrer"
          onClick={() => onSelect?.(v.content)}
        >
          <h2>
            {v.title} <IconArrowRight />
          </h2>
          <p>{v.content}</p>
        </a>
      ))}
    </div>
  );
};
