import { IconMoodSadSquint, IconTableAlias, IconChartPie } from "@tabler/icons";
import {
  Text,
  ScrollArea,
  Loader,
  createStyles,
  UnstyledButton,
  Modal,
  Group,
  ActionIcon,
  Stack,
} from "@mantine/core";
import { Prism } from "@mantine/prism";
import React, { useMemo, useState } from "react";
import { format } from "sql-formatter";
import { Typewriter } from "@/components/Typewriter";
import clsx from "clsx";
import { ChartMap } from "./ChartMap";
import { Chat2chartResponse, ColumnInfo } from "@/lib/api";

const useStyles = createStyles((theme) => ({
  loading: {
    height: 25,
    marginTop: 12,
    paddingLeft: 26,
    display: "flex",
    gap: 8,
    alignItems: "center",

    "@media (max-width: 700px)": {
      paddingLeft: 22,
    },
  },
  error: {
    display: "flex",
    alignItems: "flex-start",
    width: "100%",
    paddingLeft: 26,
    gap: 4,
    marginTop: 12,
    color: theme.colors.dark[4],

    "@media (max-width: 700px)": {
      paddingLeft: 22,
      fontSize: 14,
    },
  },
  scroll: {
    width: "98%",
    marginLeft: "auto",
    marginRight: "auto",
    marginTop: 12,
    marginBottom: 4,
    height: "auto",
    borderRadius: 8,
  },
}));

export const SearchResult: React.FC<{
  className?: string;
  isLoading: boolean;
  loadingText: string;
  result?: Chat2chartResponse;
  error: string;
}> = ({ className, isLoading, loadingText, result, error }) => {
  const { classes } = useStyles();
  const [opened, setOpened] = useState(false);
  const [type, setType] = useState("chart");
  const sqlCode = useMemo(() => {
    try {
      return format(result?.gen_sql ?? "");
    } catch (e) {
      return result?.gen_sql ?? "";
    }
  }, [result]);

  if (isLoading) {
    return (
      <div className={clsx(classes.loading, className)}>
        <Loader size={"xs"} color="gray" />
        <Typewriter content={loadingText} ellipsis />
      </div>
    );
  }

  if (!isLoading && !result) {
    return (
      <Stack>
        <Text color="dimmed" size={14}>
          Start explore your dataset by ask anything.
        </Text>
      </Stack>
    );
  }

  const chartInfo = result?.chart_info!;
  const chart = (() => {
    if (type === "table") {
      return ChartMap.Table;
    }
    return ChartMap[chartInfo?.chartName] ?? ChartMap.Table;
  })();
  const showError =
    error ||
    result?.code !== 200 ||
    !chart ||
    !result?.rows ||
    !result?.columns ||
    result?.result === 0;

  const code = (
    <>
      <Modal
        fullScreen={window.innerWidth <= 700}
        centered
        title="Generated SQL"
        opened={opened}
        size="lg"
        onClose={() => setOpened(false)}
      >
        <Prism language="sql" copiedLabel="Copied" copyLabel="Copy">
          {sqlCode}
        </Prism>
      </Modal>
    </>
  );

  if (!isLoading && showError) {
    return (
      <div className={clsx(classes.error, className)}>
        <IconMoodSadSquint />
        <Text>
          {result?.code !== 200
            ? result?.message?.endsWith(".")
              ? result.message
              : result?.message + "."
            : `Sorry, we couldn't find any thing useful for you, try to tell me more details.`}

          {result?.gen_sql && (
            <>
              <UnstyledButton onClick={() => setOpened((o) => !o)}>
                <Text size={16} color="dimmed" ml={2}>
                  View generated SQL.
                </Text>
              </UnstyledButton>
              {code}
            </>
          )}
        </Text>
      </div>
    );
  }

  const columnsObj = result?.columns.reduce((acc, next) => {
    acc[next.col] = next;
    return acc;
  }, {} as Record<string, ColumnInfo>);
  const rows = result?.rows.map((row) => {
    return row
      .map((i, index) => ({ [result.columns?.[index]?.col]: i }))
      .reduce((acc, next) => {
        return { ...acc, ...next };
      }, {} as Record<string, any>);
  });

  return (
    <Stack className={className} spacing={0}>
      <ScrollArea className={classes.scroll} h={500}>
        {React.createElement(chart as any, {
          chartInfo: chartInfo,
          columns: columnsObj,
          data: rows,
          fields: result?.columns.map((i) => ({
            name: i.col,
          })),
        })}
      </ScrollArea>

      <Group sx={{ position: "absolute", right: 0, top: 0 }}>
        <div>
          <UnstyledButton onClick={() => setOpened((o) => !o)}>
            <Text size={12} color="dimmed">
              View Generated SQL
            </Text>
          </UnstyledButton>
          {code}
        </div>

        <Group spacing={1}>
          <ActionIcon onClick={() => setType("chart")}>
            <IconChartPie
              size={16}
              color={"chart" === type ? "#228be6" : "gray"}
            />
          </ActionIcon>
          <ActionIcon onClick={() => setType("table")}>
            <IconTableAlias
              size={16}
              color={"table" === type ? "#228be6" : "gray"}
            />
          </ActionIcon>
        </Group>
      </Group>
    </Stack>
  );
};
