ALTER TABLE "users" ADD COLUMN "password" VARCHAR(256);
ALTER TABLE "users" ADD COLUMN "reset_token" VARCHAR(256);
ALTER TABLE "users" ADD COLUMN "reset_token_expiry" TIMESTAMP;

-- Update existing users with a placeholder hashed password
-- This is a placeholder. You should have a more secure way to set initial passwords.
-- The password here is 'password123' hashed with bcrypt.
UPDATE "users" SET "password" = '$2a$10$f.w9.sA7sA7n/y5i8q8z.Ov7K.4c.C/9C8v9j8n4L3x7r2p3E6a4S';
