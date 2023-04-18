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

  const response = await chat2question(id, true);
  const { job_id } = await response.json();
  console.log("chat2question job_id:", job_id);

  res.setHeader("Cache-Control", "no-cache, no-transform");
  res.setHeader("connection", "keep-alive");
  res.setHeader("Content-Type", "text/event-stream");
  res.setHeader("X-Accel-Buffering", "no");
  res.setHeader("Content-Encoding", "none");

  while (true) {
    let response = await polling(BotType.chat2question, job_id);
    response = await response.json();
    console.log("get response", response);
    res.write(`data: ${JSON.stringify(response)}\n\n`);

    if (response.status === 2) {
      break;
    }
  }
}
