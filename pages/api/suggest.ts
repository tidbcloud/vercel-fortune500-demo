import type { NextApiRequest, NextApiResponse } from "next";
import { chat2question } from "@/lib/api";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const id = req.query.id as string;

  if (req.method === "GET" && id) {
    const response = await chat2question(id);
    return res.status(200).json(await response.json());
  }

  return res.status(400).json({ message: "invalid request" });
}
