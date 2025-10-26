/*
  Warnings:

  - Added the required column `password` to the `Doctor` table without a default value. This is not possible if the table is not empty.
  - Made the column `age` on table `Patient` required. This step will fail if there are existing NULL values in that column.
  - Made the column `gender` on table `Patient` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE `Doctor` ADD COLUMN `password` VARCHAR(191) NOT NULL,
    MODIFY `specialization` VARCHAR(191) NOT NULL DEFAULT '';

-- AlterTable
ALTER TABLE `Patient` MODIFY `age` INTEGER NOT NULL,
    MODIFY `gender` VARCHAR(191) NOT NULL;
