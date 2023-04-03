import { chat2question } from "@/lib/api";

export default async function handler(req, res) {
  const id = req.query.id;

  if (req.method === "GET" && id) {
    const response = await chat2question(id);
    return res.status(200).json(await response.json());
  }

  return res.status(400).json({ message: "invalid request" });
}
