import { columnMatching } from "@/lib/api";

export const config = {
  runtime: "edge",
};

export default async function handler(req) {
  if (req.method !== "POST") {
    return new Response("Not found", { status: 404 });
  }

  const { sample_data } = await req.json();

  if (Array.isArray(sample_data) && sample_data.length > 0) {
    const response = await columnMatching(sample_data);
    return new Response(await response.text(), {
      status: 200,
      headers: {
        "content-type": "application/json",
      },
    });
  }

  return new Response(null, { status: 400 });
}
