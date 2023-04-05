/*
  Warnings:

  - You are about to drop the column `status` on the `courts` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "courts" DROP COLUMN "status",
ADD COLUMN     "is_deleted" BOOLEAN NOT NULL DEFAULT false;

-- DropEnum
DROP TYPE "court_status";
