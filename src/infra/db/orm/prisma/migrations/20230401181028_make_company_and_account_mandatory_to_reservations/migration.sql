/*
  Warnings:

  - Made the column `account_id` on table `reservations` required. This step will fail if there are existing NULL values in that column.
  - Made the column `companyId` on table `reservations` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE "reservations" DROP CONSTRAINT "reservations_account_id_fkey";

-- DropForeignKey
ALTER TABLE "reservations" DROP CONSTRAINT "reservations_companyId_fkey";

-- AlterTable
ALTER TABLE "reservations" ALTER COLUMN "account_id" SET NOT NULL,
ALTER COLUMN "companyId" SET NOT NULL;

-- AddForeignKey
ALTER TABLE "reservations" ADD CONSTRAINT "reservations_account_id_fkey" FOREIGN KEY ("account_id") REFERENCES "accounts"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "reservations" ADD CONSTRAINT "reservations_companyId_fkey" FOREIGN KEY ("companyId") REFERENCES "companies"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
