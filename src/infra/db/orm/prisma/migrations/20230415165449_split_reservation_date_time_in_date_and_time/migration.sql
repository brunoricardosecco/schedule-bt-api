/*
  Warnings:

  - You are about to drop the column `reservationEndDateTime` on the `reservations` table. All the data in the column will be lost.
  - You are about to drop the column `reservationStartDateTime` on the `reservations` table. All the data in the column will be lost.
  - You are about to drop the column `reservation_price` on the `reservations` table. All the data in the column will be lost.
  - You are about to drop the column `reservation_status` on the `reservations` table. All the data in the column will be lost.
  - Added the required column `date` to the `reservations` table without a default value. This is not possible if the table is not empty.
  - Added the required column `endTime` to the `reservations` table without a default value. This is not possible if the table is not empty.
  - Added the required column `price` to the `reservations` table without a default value. This is not possible if the table is not empty.
  - Added the required column `startTime` to the `reservations` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "reservations" DROP COLUMN "reservationEndDateTime",
DROP COLUMN "reservationStartDateTime",
DROP COLUMN "reservation_price",
DROP COLUMN "reservation_status",
ADD COLUMN     "date" TEXT NOT NULL,
ADD COLUMN     "endTime" TEXT NOT NULL,
ADD COLUMN     "price" INTEGER NOT NULL,
ADD COLUMN     "startTime" TEXT NOT NULL,
ADD COLUMN     "status" "reservation_status" NOT NULL DEFAULT 'AWAITING_PAYMENT';
