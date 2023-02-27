import { PrismaClient } from "@prisma/client";
import ShortUniqueId from "short-unique-id";
import { DATABASE_ENV } from "@/config/env";

// BigInt serialization
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
  return uid.stamp(16);
};
