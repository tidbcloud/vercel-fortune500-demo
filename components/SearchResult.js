import { IconMoodSadSquint, IconCode } from "@tabler/icons";
import { Text, ScrollArea, Collapse, Loader } from "@mantine/core";
import { Prism } from "@mantine/prism";
import React, { useState } from "react";
import { format } from "sql-formatter";
import { Typewriter } from "@/components/Typewriter";
import { ChartMap } from "./ChartMap";
import styles from "./SearchResult.module.css";

export const SearchResult = ({ isLoading, loadingText, result, error }) => {
  const [opened, setOpened] = useState(false);

  if (isLoading) {
    return (
      <div className={styles.loading}>
        <Loader size={"xs"} />
        <Typewriter content={loadingText} ellipsis />
      </div>
    );
  }

  if (!isLoading && !result) return null;

  const chartInfo = result?.chart_info;
  const chart = ChartMap[chartInfo?.chartName] ?? ChartMap.Table;
  const showError =
    error || result?.code !== 200 || !chart || result?.result === 0;

  if (!isLoading && showError) {
    return (
      <div className={styles.error}>
        <IconMoodSadSquint />
        <Text>
          {`Sorry, we couldn't find any thing useful for you, try to tell me more details.`}
        </Text>
      </div>
    );
  }

  const columnsObj = result?.columns.reduce((acc, next) => {
    acc[next.col] = next;
    return acc;
  }, {});
  const rows = result?.rows.map((row) => {
    return row
      .map((i, index) => ({ [result.columns?.[index]?.col]: i }))
      .reduce((acc, next) => {
        return { ...acc, ...next };
      }, {});
  });

  const arrow = (
    <svg
      className={`${styles.sqlIcon} ${styles.trasform} ${
        opened && styles.revertTransition
      }`}
      focusable="false"
      aria-hidden="true"
      viewBox="0 0 24 24"
      data-testid="ExpandMoreIcon"
    >
      <path d="M16.59 8.59 12 13.17 7.41 8.59 6 10l6 6 6-6z"></path>
    </svg>
  );

  const code = (
    <svg
      className={styles.iconCode}
      width="20"
      height="20"
      viewBox="0 0 22 20"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M16 15L21 10L16 5M6 5L1 10L6 15M13 1L9 19"
        stroke="black"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );

  return (
    <div>
      <div className={styles.sql}>
        <div className={styles.sqlHead}>
          <div className={styles.sqlHeadInfo}>
            <IconCode width={18} className={styles.sqlHeadInfoIcon} />
            Generated SQL
          </div>
          <div className={styles.switch} onClick={() => setOpened((o) => !o)}>
            {opened ? "Hide" : "Show"}
            {arrow}
          </div>
        </div>
        <Collapse in={opened}>
          <Prism
            language="sql"
            className={styles.code}
            copiedLabel="Copied"
            copyLabel="Copy"
          >
            {format(result?.gen_sql)}
          </Prism>
        </Collapse>
      </div>

      {chart && (
        <ScrollArea className={styles.scrollArea}>
          {React.createElement(chart, {
            className: styles.chart,
            chartInfo: chartInfo,
            columns: columnsObj,
            data: rows,
            fields: result?.columns.map((i) => ({
              name: i.col,
            })),
          })}
        </ScrollArea>
      )}
    </div>
  );
};
