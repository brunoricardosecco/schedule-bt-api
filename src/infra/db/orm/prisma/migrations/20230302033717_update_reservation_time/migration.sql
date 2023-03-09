/*
  Warnings:

  - Made the column `reservation_time_in_minutes` on table `Companies` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "Companies" ALTER COLUMN "reservation_time_in_minutes" SET NOT NULL;
