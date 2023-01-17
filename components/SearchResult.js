import { IconMoodSadSquint } from "@tabler/icons";
import { Text } from "@mantine/core";
import { Prism } from "@mantine/prism";
import React from "react";
import { format } from "sql-formatter";
import { ChartMap } from "./ChartMap";
import styles from "./SearchResult.module.css";

export const SearchResult = ({ isLoading, loadingText, result, error }) => {
  if (isLoading) {
    return <div className={styles.code}>{loadingText}</div>;
  }

  if (!isLoading && !result) return null;

  const chartInfo = result?.chart_info;
  const chart = ChartMap[chartInfo?.chartName];
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

  return (
    <div>
      <div>
        <Prism
          language="sql"
          className={styles.code}
          copiedLabel="Copied"
          copyLabel="Copy"
        >
          {format(result.gen_sql)}
        </Prism>
      </div>

      {chart && (
        <div>
          {React.createElement(chart, {
            className: styles.chart,
            chartInfo: chartInfo,
            columns: columnsObj,
            data: rows,
            fields: result?.columns.map((i) => ({
              name: i.col,
            })),
          })}
        </div>
      )}
    </div>
  );
};
