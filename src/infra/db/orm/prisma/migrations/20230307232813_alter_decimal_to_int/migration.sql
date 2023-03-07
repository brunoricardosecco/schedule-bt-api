/*
  Warnings:

  - You are about to alter the column `reservation_price` on the `Companies` table. The data in that column could be lost. The data in that column will be cast from `Decimal(10,2)` to `Integer`.
  - You are about to alter the column `reservation_price` on the `Reservations` table. The data in that column could be lost. The data in that column will be cast from `Decimal(10,2)` to `Integer`.

*/
-- AlterTable
ALTER TABLE "Companies" ALTER COLUMN "reservation_price" SET DATA TYPE INTEGER;

-- AlterTable
ALTER TABLE "Reservations" ALTER COLUMN "reservation_price" SET DATA TYPE INTEGER;
