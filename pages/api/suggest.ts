import type { NextApiRequest, NextApiResponse } from "next";
import { BotType, chat2question, polling } from "@/lib/api";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const id = req.query.id as string;
  if (req.method === "GET" && id) {
    return getQuestionSuggest(req, res);
  }

  return res.status(400).json({ message: "invalid request" });
}

async function getQuestionSuggest(req: NextApiRequest, res: NextApiResponse) {
  const id = req.query.id as string;
  const jid = req.query.jid as string;
  if (!jid) {
    const response = await chat2question(id, true);
    return res.status(200).json(await response.json());
  } else {
    const response = await polling(BotType.chat2question, jid);
    return res.status(200).json(await response.json());
  }
}
