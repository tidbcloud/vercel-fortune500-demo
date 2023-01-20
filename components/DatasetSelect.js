import { Text, createStyles, NativeSelect } from "@mantine/core";
import clsx from "clsx";

const useStyles = createStyles({
  root: {
    display: "flex",
    gap: 4,
    justifyContent: "center",
    alignItems: "center",
    fontSize: 12,
    flexWrap: "wrap",

    "@media (max-width: 700px)": {
      gap: 4,
    },
  },
});

const DATASET = [
  {
    label: "Global Fortune 500 in last 5 years",
    value: 1,
  },
  {
    label: "More dataset is coming soon...",
    value: 2,
    disabled: true,
  },
];

export const DatasetSelect = ({ className }) => {
  const { classes } = useStyles();

  return (
    <div className={clsx(classes.root, className)}>
      <Text color="gray" span>
        Data Source:
      </Text>

      <NativeSelect
        size="xs"
        styles={(theme) => ({
          input: {
            cursor: "pointer",
            minWidth: 210,
            color: theme.colors.gray[6],
          },
        })}
        data={DATASET}
        variant="unstyled"
      />
    </div>
  );
};
