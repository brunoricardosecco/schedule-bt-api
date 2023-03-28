/*
  Warnings:

  - You are about to drop the `Accounts` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Companies` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Courts` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Errors` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Reservations` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `ServiceHours` table. If the table is not empty, all the data it contains will be lost.

*/
-- CreateEnum
CREATE TYPE "role" AS ENUM ('CLIENT', 'GENERAL_ADMIN', 'COMPANY_ADMIN', 'EMPLOYEE');

-- CreateEnum
CREATE TYPE "reservation_status" AS ENUM ('PAID', 'AWAITING_PAYMENT', 'PENDING');

-- DropForeignKey
ALTER TABLE "Accounts" DROP CONSTRAINT "Accounts_company_id_fkey";

-- DropForeignKey
ALTER TABLE "Courts" DROP CONSTRAINT "Courts_company_id_fkey";

-- DropForeignKey
ALTER TABLE "Reservations" DROP CONSTRAINT "Reservations_account_id_fkey";

-- DropForeignKey
ALTER TABLE "Reservations" DROP CONSTRAINT "Reservations_companyId_fkey";

-- DropForeignKey
ALTER TABLE "ServiceHours" DROP CONSTRAINT "ServiceHours_companyId_fkey";

-- DropTable
DROP TABLE "Accounts";

-- DropTable
DROP TABLE "Companies";

-- DropTable
DROP TABLE "Courts";

-- DropTable
DROP TABLE "Errors";

-- DropTable
DROP TABLE "Reservations";

-- DropTable
DROP TABLE "ServiceHours";

-- DropEnum
DROP TYPE "ReservationStatus";

-- DropEnum
DROP TYPE "Role";

-- CreateTable
CREATE TABLE "accounts" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "company_id" TEXT,
    "email_validation_token" TEXT,
    "email_validation_token_expiration" TIMESTAMP(3),
    "hashed_password" TEXT,
    "role" "role" NOT NULL DEFAULT 'CLIENT',
    "is_confirmed" BOOLEAN NOT NULL DEFAULT false,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "accounts_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "companies" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "reservation_price" INTEGER NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "reservation_time_in_minutes" INTEGER NOT NULL,

    CONSTRAINT "companies_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "service_hours" (
    "id" TEXT NOT NULL,
    "weekday" INTEGER NOT NULL,
    "start_time" TEXT NOT NULL,
    "end_time" TEXT NOT NULL,
    "companyId" TEXT NOT NULL,

    CONSTRAINT "service_hours_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "courts" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "company_id" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "courts_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "reservations" (
    "id" TEXT NOT NULL,
    "reservation_price" INTEGER NOT NULL,
    "reservation_status" "reservation_status" NOT NULL DEFAULT 'AWAITING_PAYMENT',
    "reservationDate" TIMESTAMP(3) NOT NULL,
    "description" TEXT,
    "account_id" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "companyId" TEXT,

    CONSTRAINT "reservations_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "errors" (
    "id" TEXT NOT NULL,
    "stack" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "errors_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "accounts_email_key" ON "accounts"("email");

-- AddForeignKey
ALTER TABLE "accounts" ADD CONSTRAINT "accounts_company_id_fkey" FOREIGN KEY ("company_id") REFERENCES "companies"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "service_hours" ADD CONSTRAINT "service_hours_companyId_fkey" FOREIGN KEY ("companyId") REFERENCES "companies"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "courts" ADD CONSTRAINT "courts_company_id_fkey" FOREIGN KEY ("company_id") REFERENCES "companies"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "reservations" ADD CONSTRAINT "reservations_account_id_fkey" FOREIGN KEY ("account_id") REFERENCES "accounts"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "reservations" ADD CONSTRAINT "reservations_companyId_fkey" FOREIGN KEY ("companyId") REFERENCES "companies"("id") ON DELETE SET NULL ON UPDATE CASCADE;
