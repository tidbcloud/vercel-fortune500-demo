import { PrismaClient, Prisma } from "@prisma/client";
import ShortUniqueId from "short-unique-id";
import { DATABASE_ENV } from "@/config/env";
import { ColumnDescription } from "@/lib/api";

export { Prisma };

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
  const data = await prisma.file.findFirst({
    select: {
      structure: true,
    },
    where: {
      table: id,
    },
  });

  if (
    data?.structure &&
    typeof data.structure === "object" &&
    Array.isArray(data.structure)
  ) {
    return data?.structure as any as ColumnDescription[];
  }
  return null;
}
