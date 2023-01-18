import { IconMoodSadSquint } from "@tabler/icons";
import { Text, Collapse } from "@mantine/core";
import { Prism } from "@mantine/prism";
import React, { useState } from "react";
import { format } from "sql-formatter";
import { ChartMap } from "./ChartMap";
import styles from "./SearchResult.module.css";

export const SearchResult = ({ isLoading, loadingText, result, error }) => {
  const [opened, setOpened] = useState(false);

  if (isLoading) {
    return <div className={styles.code}>{loadingText}</div>;
  }

  if (!isLoading && !result) return null;

  const chartInfo = result?.chart_info;
  const chart = ChartMap[chartInfo?.chartName || "TableChart"];
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

  return (
    <div>
      <div className={styles.sql}>
        <div className={styles.sqlHead}>
          <div className={styles.sqlHeadInfo}>Generated SQL</div>
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
            {format(result.gen_sql)}
          </Prism>
        </Collapse>
      </div>

      {chart &&
        React.createElement(chart, {
          className: styles.chart,
          chartInfo: chartInfo,
          columns: columnsObj,
          data: rows,
          fields: result?.columns.map((i) => ({
            name: i.col,
          })),
        })}
    </div>
  );
};
