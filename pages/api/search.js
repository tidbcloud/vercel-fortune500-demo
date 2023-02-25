export const config = {
  runtime: "edge",
};

const TIDBCLOUD_ENV = {
  url: process.env.TIDBCLOUD_URL,
  api_key: process.env.TIDBCLOUD_API_KEY,
  db: process.env.TIDBCLOUD_DB,
  cluster_id: process.env.TIDBCLOUD_CLUSTER_ID,
};

export default async function handler(req, res) {
  const { searchParams } = new URL(req.url);
  const query = searchParams.get("q");
  const id = searchParams.get("id");

  if (req.method === "GET" && query && id) {
    const response = await fetch(TIDBCLOUD_ENV.url, {
      method: "POST",
      body: JSON.stringify({
        cluster_id: TIDBCLOUD_ENV.cluster_id,
        database: id,
        instruction: query,
      }),
      headers: {
        "api-key": TIDBCLOUD_ENV.api_key,
      },
    });

    return new Response(await response.text(), {
      status: 200,
      headers: {
        "content-type": "application/json",
      },
    });
  }

  return new Response(null, { status: 400 });
}
