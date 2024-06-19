import type { NextApiRequest, NextApiResponse } from "next";
import { createHash } from "crypto";
import sql from "sqlstring";
import { z } from "zod";
import { omit, snakeCase } from "lodash-es";
import { generateUniqueName, prisma, Prisma } from "@/lib/db";
import { DATABASE_ENV } from "@/config/env";
import { parse } from "@/lib/csv";
import { isNumeric } from "@/lib/utils";
import type { ColumnDescription } from "@/lib/api";

const UploadFileBody = z.object({
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

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "POST") {
    return res.status(404).json({ message: "not found" });
  }

  try {
    UploadFileBody.parse(req.body);
  } catch (e) {
    return res.status(400).json({ message: "invalid request" });
  }

  const { filename, columns, content } = req.body as z.infer<
    typeof UploadFileBody
  >;

  console.log("filename", filename);
  console.log("columns: ", columns);

  const hash = createHash("md5").update(content).digest("hex");

  try {
    const row = await prisma.file.findFirst({
      where: {
        hash,
      },
    });

    if (row) {
      console.log("file exist, skip...", row);

      await prisma.file.update({
        where: {
          id: row.id,
        },
        data: {
          structure: columns.map((i) => ({
            ...i,
            column: snakeCase(i.column),
          })),
        },
      });
      return res
        .status(200)
        .json({ message: "success", data: { id: row.table } });
    }
  } catch (e) {
    console.error(e);
  }

  try {
    let data: any[], _columns: string[];
    try {
      [_columns, data] = await parse(content);
    } catch (e) {
      [_columns, data] = await parse(content, { delimiter: ";" });
    }

    const normalizedColumns: ColumnDescription[] = _columns.map(
      (i) => columns.find((j: ColumnDescription) => j.column === snakeCase(i))!
    );

    const columnsSql = normalizedColumns
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
      data.map((row) =>
        row.map((v: string, i: number) =>
          normalizedColumns[i].type.toLowerCase().includes("int")
            ? isNaN(Number(v))
              ? null
              : Number(v)
            : v
        )
      ),
    ]);

    console.log("insertStatement:", insertStatement);
    console.log("normalizedColumns:", normalizedColumns);

    await prisma.$transaction([
      prisma.$executeRawUnsafe(createTableStatement),
      prisma.$executeRawUnsafe(insertStatement),
      prisma.file.create({
        data: {
          filename,
          table,
          hash,
          structure: normalizedColumns.map((i) =>
            omit(i, "isLoading")
          ) as Prisma.JsonArray,
        },
      }),
    ]);

    return res.status(200).json({ message: "ok", data: { id: table } });
  } catch (e: any) {
    return res.status(400).json({
      message: `Parse error: ${e.message}, please try another file.`,
    });
  }
}