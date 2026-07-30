import "dotenv/config";
import { test, describe, before, after } from "node:test";
import assert from "node:assert";
import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";

describe("Database connection", () => {
  let prisma: PrismaClient;

  before(() => {
    const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL });
    prisma = new PrismaClient({ adapter });
  });

  after(async () => {
    await prisma.$disconnect();
  });

  test("connects and runs a basic query", async () => {
    const result = await prisma.$queryRawUnsafe<Record<string, unknown>[]>(
      "SELECT 1 AS ok"
    );
    assert.strictEqual(result[0]?.ok, 1);
  });

  test("can inspect database metadata", async () => {
    const result = await prisma.$queryRawUnsafe<Record<string, unknown>[]>(
      "SELECT current_database() AS db, current_schema() AS schema, version() AS version"
    );
    assert.ok(result[0]?.db);
    assert.ok(result[0]?.schema);
    assert.ok(result[0]?.version);
  });

  test("lists existing tables in public schema", async () => {
    const tables = await prisma.$queryRawUnsafe<Record<string, string>[]>(
      `SELECT table_name FROM information_schema.tables
       WHERE table_schema = 'public'
       ORDER BY table_name`
    );
    assert.ok(Array.isArray(tables));
  });
});
