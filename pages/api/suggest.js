import { useRouter } from "next/router";
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
  const id = searchParams.get("id");

  if (req.method === "POST" && id) {
    const response = await fetch(`https://data.tidbcloud.com/api/v1beta/apps/${ process.env.TIDBCLOUD_APP_ID}/v1/chat2question`, {
      method: "POST",
      body: JSON.stringify({
        cluster_id: TIDBCLOUD_ENV.cluster_id,
        database: id,
        question_num: 3,
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
