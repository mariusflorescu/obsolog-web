import { PrismaClient } from "@prisma/client";

export * from "@prisma/client";

let persistedInstance: PrismaClient | undefined = undefined;

let db: PrismaClient;

if (process.env.NODE_ENV === "production") {
  db = new PrismaClient();
} else {
  if (!persistedInstance) {
    persistedInstance = new PrismaClient();
  }
  db = persistedInstance;
}

export { db };
