import { chat2question } from "@/lib/api";

export const config = {
  runtime: "edge",
};

export default async function handler(req, res) {
  const { searchParams } = new URL(req.url);
  const id = searchParams.get("id");

  if (req.method === "GET" && id) {
    const response = await chat2question(id);
    return new Response(await response.text(), {
      status: 200,
      headers: {
        "content-type": "application/json",
      },
    });
  }

  return new Response(null, { status: 400 });
}
