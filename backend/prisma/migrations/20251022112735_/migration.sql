/*
  Warnings:

  - You are about to alter the column `status` on the `Appointment` table. The data in that column could be lost. The data in that column will be cast from `VarChar(191)` to `Enum(EnumId(0))`.
  - A unique constraint covering the columns `[phone]` on the table `Doctor` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[phone]` on the table `Patient` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE `Appointment` MODIFY `status` ENUM('PENDING', 'BOOKED') NOT NULL DEFAULT 'PENDING';

-- CreateIndex
CREATE UNIQUE INDEX `Doctor_phone_key` ON `Doctor`(`phone`);

-- CreateIndex
CREATE UNIQUE INDEX `Patient_phone_key` ON `Patient`(`phone`);
