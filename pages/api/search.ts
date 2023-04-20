import type { NextApiRequest, NextApiResponse } from "next";
import { chat2chart } from "@/lib/api";
import { getColumnDescriptions } from "@/lib/db";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const query = req.query.q as string;
  const id = req.query.id as string;

  if (req.method === "GET" && query && id) {
    try {
      const schema = await getColumnDescriptions(id);
      if (schema) {
        const response = await chat2chart(query, id, {
          [id]: schema,
        });
        return res.status(200).json(await response.json());
      } else {
        return res.status(404).json({ message: "not found" });
      }
    } catch (e: any) {
      return res.status(500).json({ message: e.message });
    }
  }

  return res.status(400).json({ message: "invalid request" });
}
