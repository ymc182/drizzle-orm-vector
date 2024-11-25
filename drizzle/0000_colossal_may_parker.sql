CREATE EXTENSION IF NOT EXISTS vector;
CREATE TABLE IF NOT EXISTS "evm_wallets_table" (
	"id" serial PRIMARY KEY NOT NULL,
	"address" text NOT NULL,
	"userEmail" text,
	"embedding" vector(1536),
	CONSTRAINT "evm_wallets_table_address_unique" UNIQUE("address")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "users_table" (
	"id" serial PRIMARY KEY NOT NULL,
	"age" integer DEFAULT 0,
	"email" text NOT NULL,
	CONSTRAINT "users_table_email_unique" UNIQUE("email")
);
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "evm_wallets_table" ADD CONSTRAINT "evm_wallets_table_userEmail_users_table_email_fk" FOREIGN KEY ("userEmail") REFERENCES "public"."users_table"("email") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "embedding_index" ON "evm_wallets_table" USING hnsw ("embedding" vector_cosine_ops);