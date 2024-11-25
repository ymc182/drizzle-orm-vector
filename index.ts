import { cosineDistance, desc, gt, sql } from "drizzle-orm";
import db from "./src/lib/db/db";
import { evmWalletsTable, usersTable } from "./src/lib/db/schema/schema";
import { createEvmWalletForUser } from "./src/lib/db/schema/schema";
import { generateEmbedding } from "./src/lib/db/utils";

async function findSimilarWallets(description: string) {
  const embedding = await generateEmbedding(description);
  const similarity = sql<number>`1 - (${cosineDistance(evmWalletsTable.embedding, embedding)})`;
  const similarWallets = await db
    .select({ address: evmWalletsTable.address, similarity })
    .from(evmWalletsTable)
    .where(gt(similarity, 0.5))
    .orderBy((t) => desc(t.similarity));
  return similarWallets;
}

const res = await findSimilarWallets("1234567");
console.log(res);

process.exit(0);
