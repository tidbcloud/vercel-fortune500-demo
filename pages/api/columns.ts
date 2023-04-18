import type { NextApiRequest, NextApiResponse } from "next";
import sql from "sqlstring";
import { BotType, columnMatching, polling } from "@/lib/api";
import { getColumnDescriptions, prisma } from "@/lib/db";
import { z, ZodError } from "zod";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "POST") {
    return getColumnMatchingFromDataService(req, res);
  } else if (req.method === "GET") {
    return getCurrentColumnDescriptions(req, res);
  } else if (req.method === "PUT") {
    return editColumnDescriptions(req, res);
  }

  return res.status(404).json({ message: "not found" });
}

async function getCurrentColumnDescriptions(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const id = req.query.id;
  if (id && typeof id === "string") {
    const schema = await getColumnDescriptions(id);
    return res.status(200).json({ message: "ok", data: schema });
  }
  return res.status(400).json({ message: "invalid request" });
}

async function getColumnMatchingFromDataService(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { sample_data, async: isAsync, job_id } = req.body;
  if (job_id) {
    console.log("getColumnMatchingFromDataService:", job_id);
    const response = await polling(BotType.data2columnMatching, job_id);
    return res.status(200).json(await response.json());
  } else if (Array.isArray(sample_data) && sample_data.length > 0) {
    const response = await columnMatching(sample_data, isAsync);
    return res.status(200).json(await response.json());
  }

  return res.status(400).json({ message: "invalid request" });
}

const editColumnDescriptionBody = z.object({
  column: z.string(),
  type: z.string(),
  description: z.string(),
  id: z.string(),
});

async function editColumnDescriptions(
  req: NextApiRequest,
  res: NextApiResponse
) {
  console.log(typeof req.body, req.body);
  try {
    editColumnDescriptionBody.parse(req.body);
  } catch (e: any) {
    return res
      .status(400)
      .json({ message: (e as ZodError).format()._errors.join() });
  }
  const { column, id: table, type, description } = req.body;

  const editColumnSql = sql.format(
    `ALTER TABLE ?? MODIFY COLUMN ?? ${type} COMMENT ?`,
    [table, column, description]
  );

  console.log("editColumnSql: ", editColumnSql);

  await prisma.$executeRawUnsafe(editColumnSql);
  return res.status(200).json({ message: "ok" });
}
