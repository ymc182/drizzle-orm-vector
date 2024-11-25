ALTER TABLE "evm_wallets_table" DROP CONSTRAINT "evm_wallets_table_userEmail_users_table_email_fk";
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "evm_wallets_table" ADD CONSTRAINT "evm_wallets_table_userEmail_users_table_email_fk" FOREIGN KEY ("userEmail") REFERENCES "public"."users_table"("email") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
