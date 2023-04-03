import sql from "sqlstring";
import { chat2chart } from "@/lib/api";
import { prisma } from "@/lib/db";
import { DATABASE_ENV } from "@/config/env";

export default async function handler(req, res) {
  const query = req.query.q;
  const id = req.query.id;

  if (req.method === "GET" && query && id) {
    try {
      const stmt = sql.format("SHOW FULL COLUMNS FROM ??.??", [
        DATABASE_ENV.database,
        id,
      ]);
      console.log(stmt);

      const result = await prisma.$queryRawUnsafe(stmt);

      const schema = result.map((i) => ({
        column: i.Field,
        type: i.Type,
        description: i.Comment,
      }));

      const response = await chat2chart(query, id, {
        [id]: schema,
      });
      return res.status(200).json(await response.json());
    } catch (e) {
      return res.status(500).json({ message: e.message });
    }
  }

  return res.status(400).json({ message: "invalid request" });
}
