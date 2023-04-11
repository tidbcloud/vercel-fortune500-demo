import { TIDBCLOUD_ENV } from "@/config/env";

const headers = {
  "api-key": TIDBCLOUD_ENV.api_key!,
};

const api = `https://${TIDBCLOUD_ENV.api_host}/api/v1beta/apps/chat2query-${TIDBCLOUD_ENV.api_id}/v1`;

export interface Chat2questionResponse {
  code: number;
  cost_time: string;
  message: string;
  questions: Array<{
    question: string;
    question_id: number;
    question_keyword: string;
  }>;
}

export function chat2question(table: string) {
  return fetch(`${api}/chat2question`, {
    method: "POST",
    body: JSON.stringify({
      cluster_id: TIDBCLOUD_ENV.cluster_id,
      database: TIDBCLOUD_ENV.cluster_db,
      question_num: 4,
      tables: [table],
    }),
    headers,
  });
}

export interface BarChartInfo {
  chartName: "BarChart";
  title: string;
  options: {
    x: string;
    y: string;
  };
}

export interface PieChartInfo {
  chartName: "PieChart";
  title: string;
  options: {
    label: string;
    value: string;
  };
}

export interface LineChartInfo {
  chartName: "PieChart";
  title: string;
  options: {
    x: string;
    y: string;
  };
}

export interface TableInfo {
  chartName: "Table";
  title: string;
  options: {
    x: string;
    y: string;
  };
}

export type ChartInfo = BarChartInfo | PieChartInfo | LineChartInfo | TableInfo;

export interface ColumnInfo {
  col: string;
  data_type: string;
  nullable: boolean;
}

export interface Chat2chartResponse {
  call_openai_time: string;
  chart_info: ChartInfo;
  code: number;
  columns: ColumnInfo[];
  cost_time: string;
  end_time: string;
  execute_time: string;
  gen_sql: string;
  limit: number;
  query: string;
  row_count: number;
  rows: any[][];
  start_time: string;
  message?: string;
  result?: number;
}

export interface ColumnDescription {
  column: string;
  type: string;
  description: string;
}

export function chat2chart(
  query: string,
  table: string,
  database_schema?: { [index: string]: ColumnDescription[] }
) {
  return fetch(`${api}/chat2chart`, {
    method: "POST",
    body: JSON.stringify({
      cluster_id: TIDBCLOUD_ENV.cluster_id,
      database: TIDBCLOUD_ENV.cluster_db,
      instruction: query,
      tables: [table],
      database_schema,
    }),
    headers,
  });
}

export interface ColumnMatchingResponse {
  code: number;
  columns: ColumnDescription[];
  cost_time: string;
  message: string;
}

export function columnMatching(sample_data: any[]) {
  return fetch(`${api}/data2column-match`, {
    method: "POST",
    body: JSON.stringify({
      sample_data,
    }),
    headers,
  });
}
