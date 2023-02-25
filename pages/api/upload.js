import { createHash } from "crypto";
import { generateDatabaseName, prisma } from "@/lib/db";
import { parse } from "@/lib/csv";

export default async function handler(req, res) {
  const { content, filename } = req.body;

  if (
    req.method === "POST" &&
    filename &&
    content &&
    typeof content === "string"
  ) {
    const [columns, data] = await parse(content);
    const columnsSql = columns.map((i) => `\`${i}\` TEXT`).join(",");
    const dataSql = data
      .map((i) => `(${i.map((j) => `"${j}"`).join(",")})`)
      .join(",");

    const db = generateDatabaseName();
    const table = "userdata";
    const createDatabaseStatement = `CREATE DATABASE ${db};`;
    const createTableStatement = `CREATE TABLE IF NOT EXISTS \`${db}\`.\`${table}\` (${columnsSql});`;
    const insertStatement = `INSERT INTO \`${db}\`.\`${table}\` VALUES ${dataSql};`;

    await prisma.$executeRawUnsafe(createDatabaseStatement);
    await prisma.$executeRawUnsafe(createTableStatement);
    await prisma.$executeRawUnsafe(insertStatement);

    await prisma.file.create({
      data: {
        filename,
        db,
        table,
        hash: createHash("md5").update(content).digest("hex"),
      },
    });

    return res.status(200).json({ message: "success", data: { id: db } });
  }

  res.status(400).json({ message: "invalid request" });
}
