import { createHash } from "crypto";
import sqlstring from "sqlstring";
import { generateUniqueName, prisma } from "@/lib/db";
import { DATABASE_ENV } from "@/config/env";
import { parse } from "@/lib/csv";
import { isNumeric } from "@/lib/utils";

export default async function handler(req, res) {
  const { content, filename } = req.body;

  try {
    if (
      req.method === "POST" &&
      filename &&
      content &&
      typeof content === "string"
    ) {
      const [columns, data] = await parse(content);

      if (columns.some((i) => isNumeric(i))) {
        // not a valid header
        return res.status(400).json({
          message: "It seems this file does not contain valid header",
        });
      }

      const columnsSql = columns
        .map((i, index) => {
          return sqlstring.format(
            `?? ${data.every((row) => isNumeric(row[index])) ? "INT" : "TEXT"}`,
            [i || `c${index}`]
          );
        })
        .join(",");

      const db = DATABASE_ENV.database;
      const table = generateUniqueName();

      const createTableStatement =
        sqlstring.format("CREATE TABLE IF NOT EXISTS ??.?? ", [db, table]) +
        `(${columnsSql})`;

      console.log(createTableStatement);

      const insertStatement = sqlstring.format("INSERT INTO ??.?? VALUES ?", [
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
    }

    res.status(400).json({ message: "invalid request" });
  } catch (ex) {
    res.status(500).json({
      message: `Parse error: ${ex.message}, please try another file.`,
    });
  }
}
