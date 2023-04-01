/*
  Warnings:

  - You are about to drop the column `reservationDate` on the `reservations` table. All the data in the column will be lost.
  - Added the required column `reservationEndDateTime` to the `reservations` table without a default value. This is not possible if the table is not empty.
  - Added the required column `reservationStartDateTime` to the `reservations` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "reservations" DROP COLUMN "reservationDate",
ADD COLUMN     "reservationEndDateTime" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "reservationStartDateTime" TIMESTAMP(3) NOT NULL;
