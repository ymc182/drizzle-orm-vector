import { pgTable, integer, text, vector, serial, index, jsonb } from "drizzle-orm/pg-core";
import db from "../db";
import { generateEmbedding } from "../utils";
import { eq } from "drizzle-orm";

export const usersTable = pgTable("users_table", {
  id: serial("id").primaryKey(),
  age: integer().default(0),
  email: text().notNull().unique(),
});

export const evmWalletsTable = pgTable(
  "evm_wallets_table",
  {
    id: serial("id").primaryKey(),
    address: text().notNull().unique(),
    userEmail: text()
      .references(() => usersTable.email, { onDelete: "cascade" })
      .unique(),
    embedding: vector("embedding", { dimensions: 1536 }),
  },
  (table) => ({
    embeddingIndex: index("embedding_index").using("hnsw", table.embedding.op("vector_cosine_ops")),
  })
);

export async function createEvmWalletForUser(address: string, userEmail: string) {
  //check if user exists
  const user = await db.select().from(usersTable).where(eq(usersTable.email, userEmail));
  if (!user) {
    throw new Error("User not found");
  }
  const embedding = await generateEmbedding(address);
  return db.insert(evmWalletsTable).values({ address, userEmail, embedding });
}

export async function getEvmWalletsForUser(userEmail: string) {
  return db.select().from(evmWalletsTable).where(eq(evmWalletsTable.userEmail, userEmail));
}
