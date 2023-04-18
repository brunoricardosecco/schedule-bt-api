/*
  Warnings:

  - You are about to drop the column `companyId` on the `reservations` table. All the data in the column will be lost.
  - You are about to drop the column `endTime` on the `reservations` table. All the data in the column will be lost.
  - You are about to drop the column `startTime` on the `reservations` table. All the data in the column will be lost.
  - Added the required column `company_id` to the `reservations` table without a default value. This is not possible if the table is not empty.
  - Added the required column `end_time` to the `reservations` table without a default value. This is not possible if the table is not empty.
  - Added the required column `start_time` to the `reservations` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "reservations" DROP CONSTRAINT "reservations_companyId_fkey";

-- AlterTable
ALTER TABLE "reservations" DROP COLUMN "companyId",
DROP COLUMN "endTime",
DROP COLUMN "startTime",
ADD COLUMN     "company_id" TEXT NOT NULL,
ADD COLUMN     "end_time" TEXT NOT NULL,
ADD COLUMN     "start_time" TEXT NOT NULL;

-- AddForeignKey
ALTER TABLE "reservations" ADD CONSTRAINT "reservations_company_id_fkey" FOREIGN KEY ("company_id") REFERENCES "companies"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
