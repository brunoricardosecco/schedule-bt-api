/*
  Warnings:

  - You are about to drop the column `create_at` on the `Accounts` table. All the data in the column will be lost.
  - You are about to drop the column `password` on the `Accounts` table. All the data in the column will be lost.
  - You are about to drop the column `update_at` on the `Accounts` table. All the data in the column will be lost.
  - You are about to drop the column `create_at` on the `Errors` table. All the data in the column will be lost.
  - You are about to drop the column `update_at` on the `Errors` table. All the data in the column will be lost.

*/
-- CreateEnum
CREATE TYPE "Role" AS ENUM ('USER', 'GENERAL_ADMIN', 'COMPANY_ADMIN', 'EMPLOYEE');

-- CreateEnum
CREATE TYPE "ReservationStatus" AS ENUM ('PAID', 'AWAITING_PAYMENT', 'PENDING');

-- AlterTable
ALTER TABLE "Accounts" DROP COLUMN "create_at",
DROP COLUMN "password",
DROP COLUMN "update_at",
ADD COLUMN     "company_id" TEXT,
ADD COLUMN     "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "email_validation_token" TEXT,
ADD COLUMN     "email_validation_token_expiration" TIMESTAMP(3),
ADD COLUMN     "hashed_password" TEXT,
ADD COLUMN     "is_confirmed" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "role" "Role" NOT NULL DEFAULT 'USER',
ADD COLUMN     "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;

-- AlterTable
ALTER TABLE "Errors" DROP COLUMN "create_at",
DROP COLUMN "update_at",
ADD COLUMN     "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;

-- CreateTable
CREATE TABLE "Companies" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "reservation_price" DECIMAL(10,2) NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "reservation_time_in_minutes" TEXT NOT NULL,

    CONSTRAINT "Companies_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ServiceHours" (
    "id" TEXT NOT NULL,
    "weekday" INTEGER NOT NULL,
    "start_time" TEXT NOT NULL,
    "end_time" TEXT NOT NULL,
    "companyId" TEXT NOT NULL,

    CONSTRAINT "ServiceHours_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Courts" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "company_id" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Courts_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Reservations" (
    "id" TEXT NOT NULL,
    "reservation_price" DECIMAL(10,2) NOT NULL,
    "reservation_status" "ReservationStatus" NOT NULL DEFAULT 'AWAITING_PAYMENT',
    "reservationDate" TIMESTAMP(3) NOT NULL,
    "description" TEXT,
    "account_id" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "companyId" TEXT,

    CONSTRAINT "Reservations_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Accounts" ADD CONSTRAINT "Accounts_company_id_fkey" FOREIGN KEY ("company_id") REFERENCES "Companies"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ServiceHours" ADD CONSTRAINT "ServiceHours_companyId_fkey" FOREIGN KEY ("companyId") REFERENCES "Companies"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Courts" ADD CONSTRAINT "Courts_company_id_fkey" FOREIGN KEY ("company_id") REFERENCES "Companies"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Reservations" ADD CONSTRAINT "Reservations_account_id_fkey" FOREIGN KEY ("account_id") REFERENCES "Accounts"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Reservations" ADD CONSTRAINT "Reservations_companyId_fkey" FOREIGN KEY ("companyId") REFERENCES "Companies"("id") ON DELETE SET NULL ON UPDATE CASCADE;
