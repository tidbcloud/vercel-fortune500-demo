import { PrismaClient } from "@prisma/client";
import ShortUniqueId from "short-unique-id";

// BigInt serialization
BigInt.prototype.toJSON = function () {
  return this.toString();
};

const dbConfig = {
  host: process.env.TIDB_HOST,
  port: process.env.TIDB_PORT,
  user: process.env.TIDB_USER,
  password: process.env.TIDB_PASSWORD,
  database: process.env.TIDB_DATABASE ?? "",
};

const SSL_FLAGS = "pool_timeout=60&sslaccept=accept_invalid_certs";
const url = `mysql://${dbConfig.user}:${dbConfig.password}@${dbConfig.host}:4000/${dbConfig.database}?${SSL_FLAGS}`;

export const prisma = new PrismaClient({
  datasources: {
    db: {
      url,
    },
  },
});

const uid = new ShortUniqueId();
export const generateDatabaseName = () => {
  // with a timestamp
  return `upload_${uid.stamp(16)}`;
};
