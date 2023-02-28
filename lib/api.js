import { TIDBCLOUD_ENV } from "@/config/env";

const headers = {
  "api-key": TIDBCLOUD_ENV.api_key,
};

export const chat2question = (table) => {
  return fetch(
    `https://data.tidbcloud.com/api/v1beta/apps/chat2query-${TIDBCLOUD_ENV.api_id}/v1/chat2question`,
    {
      method: "POST",
      body: JSON.stringify({
        cluster_id: TIDBCLOUD_ENV.cluster_id,
        database: TIDBCLOUD_ENV.cluster_db,
        question_num: 4,
        tables: [table],
      }),
      headers,
    }
  );
};

export const chat2chart = (query, table) => {
  return fetch(
    `https://data.tidbcloud.com/api/v1beta/apps/chat2query-${TIDBCLOUD_ENV.api_id}/v1/chat2chart`,
    {
      method: "POST",
      body: JSON.stringify({
        cluster_id: TIDBCLOUD_ENV.cluster_id,
        database: TIDBCLOUD_ENV.cluster_db,
        instruction: query,
        tables: [table],
      }),
      headers,
    }
  );
};
