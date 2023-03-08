import { createHash } from "crypto";
import sql from "sqlstring";
import { z } from "zod";
import { generateUniqueName, prisma } from "@/lib/db";
import { DATABASE_ENV } from "@/config/env";
import { parse } from "@/lib/csv";
import { isNumeric } from "@/lib/utils";

const Payload = z.object({
  filename: z.string(),
  columns: z
    .object({
      column: z.string(),
      type: z.string(),
      description: z.string(),
    })
    .array(),
  content: z.string(),
});

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(404).json({ message: "not found" });
  }

  const { filename, columns, content } = req.body;

  console.log("filename", filename);
  console.log("columns: ", columns);

  try {
    Payload.parse(req.body);
  } catch (e) {
    return res.status(400).json({ message: "invalid request" });
  }

  try {
    let data, _columns;
    try {
      [_columns, data] = await parse(content);
    } catch (e) {
      [_columns, data] = await parse(content, { delimiter: ";" });
    }

    _columns = _columns.map((i) => columns.find((j) => j.column === i));

    const columnsSql = _columns
      .map((i, index) => {
        return sql.format(
          `?? ${
            data.every((row) => isNumeric(row[index])) ? "BIGINT" : "TEXT"
          } COMMENT ?`,
          [i.column || `unnamed_${index}`, i.description]
        );
      })
      .join(",");

    const db = DATABASE_ENV.database;
    const table = generateUniqueName();

    const createTableStatement =
      sql.format("CREATE TABLE IF NOT EXISTS ??.?? ", [db, table]) +
      `(${columnsSql})`;

    console.log("createTableStatement: ", createTableStatement);

    const insertStatement = sql.format("INSERT INTO ??.?? VALUES ?", [
      db,
      table,
      data,
    ]);

    await prisma.$transaction([
      prisma.$executeRawUnsafe(createTableStatement),
      prisma.$executeRawUnsafe(insertStatement),
      prisma.file.create({
        data: {
          filename,
          table,
          hash: createHash("md5").update(content).digest("hex"),
        },
      }),
    ]);

    return res.status(200).json({ message: "success", data: { id: table } });
  } catch (e) {
    return res.status(400).json({
      message: `Parse error: ${e.message}, please try another file.`,
    });
  }
}
