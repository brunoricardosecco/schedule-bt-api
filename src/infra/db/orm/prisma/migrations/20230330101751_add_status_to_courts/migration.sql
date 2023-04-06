-- CreateEnum
CREATE TYPE "court_status" AS ENUM ('ACTIVE', 'INACTIVE');

-- AlterTable
ALTER TABLE "courts" ADD COLUMN     "status" "court_status" NOT NULL DEFAULT 'ACTIVE';
