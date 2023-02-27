// do not use this in client code otherwise it will be bundled into client javascript
export const TIDBCLOUD_ENV = {
  api_id: process.env.TIDBCLOUD_API_ID,
  api_key: process.env.TIDBCLOUD_API_KEY,
  cluster_id: process.env.TIDBCLOUD_CLUSTER_ID,
  cluster_db: process.env.TIDB_DATABASE,
};

export const DATABASE_ENV = {
  host: process.env.TIDB_HOST,
  port: process.env.TIDB_PORT,
  user: process.env.TIDB_USER,
  password: process.env.TIDB_PASSWORD,
  database: process.env.TIDB_DATABASE ?? "",
};
