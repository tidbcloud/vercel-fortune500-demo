import { PrismaClient } from "@prisma/client";
import ShortUniqueId from "short-unique-id";
import { DATABASE_ENV } from "@/config/env";
import sql from "sqlstring";
import { ColumnDescription } from "./api";

// BigInt serialization
// @ts-ignore
BigInt.prototype.toJSON = function () {
  return this.toString();
};

const SSL_FLAGS = "pool_timeout=60&sslaccept=accept_invalid_certs";
const url = `mysql://${DATABASE_ENV.user}:${DATABASE_ENV.password}@${DATABASE_ENV.host}:4000/${DATABASE_ENV.database}?${SSL_FLAGS}`;

export const prisma = new PrismaClient({
  datasources: {
    db: {
      url,
    },
  },
});

const uid = new ShortUniqueId();
export const generateUniqueName = () => {
  // with a timestamp
  return "u" + uid.stamp(16);
};

export async function getColumnDescriptions(id: string) {
  const stmt = sql.format("SHOW FULL COLUMNS FROM ??.??", [
    DATABASE_ENV.database,
    id,
  ]);
  console.log(stmt);

  const result: any[] = await prisma.$queryRawUnsafe(stmt);
  const schema: ColumnDescription[] = result.map((i) => ({
    column: i.Field,
    type: i.Type,
    description: i.Comment,
  }));

  return schema;
}
