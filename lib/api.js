import { TIDBCLOUD_ENV } from "@/config/env";

const headers = {
  "api-key": TIDBCLOUD_ENV.api_key,
};

const api = `https://data.tidbcloud.com/api/v1beta/apps/chat2query-${TIDBCLOUD_ENV.api_id}/v1`;

/**
 * @param {string} table
 */
export function chat2question(table) {
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

/**
 * @param {string} query
 * @param {string} table
 */
export function chat2chart(query, table) {
  return fetch(`${api}/chat2chart`, {
    method: "POST",
    body: JSON.stringify({
      cluster_id: TIDBCLOUD_ENV.cluster_id,
      database: TIDBCLOUD_ENV.cluster_db,
      instruction: query,
      tables: [table],
    }),
    headers,
  });
}

/**
 * @param {any[]} sample_data
 */
export function columnMatching(sample_data) {
  return fetch(`${api}/data2column-match`, {
    method: "POST",
    body: JSON.stringify({
      sample_data,
    }),
    headers,
  });
}
