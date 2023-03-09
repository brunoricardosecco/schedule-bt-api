/*
  Warnings:

  - The values [USER] on the enum `Role` will be removed. If these variants are still used in the database, this will fail.
  - The `reservation_time_in_minutes` column on the `Companies` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "Role_new" AS ENUM ('CLIENT', 'GENERAL_ADMIN', 'COMPANY_ADMIN', 'EMPLOYEE');
ALTER TABLE "Accounts" ALTER COLUMN "role" DROP DEFAULT;
ALTER TABLE "Accounts" ALTER COLUMN "role" TYPE "Role_new" USING ("role"::text::"Role_new");
ALTER TYPE "Role" RENAME TO "Role_old";
ALTER TYPE "Role_new" RENAME TO "Role";
DROP TYPE "Role_old";
ALTER TABLE "Accounts" ALTER COLUMN "role" SET DEFAULT 'CLIENT';
COMMIT;

-- AlterTable
ALTER TABLE "Accounts" ALTER COLUMN "role" SET DEFAULT 'CLIENT';

-- AlterTable
ALTER TABLE "Companies" DROP COLUMN "reservation_time_in_minutes",
ADD COLUMN     "reservation_time_in_minutes" INTEGER;
