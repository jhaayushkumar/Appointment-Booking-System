/*
  Warnings:

  - Added the required column `password` to the `Patient` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `Patient` ADD COLUMN `password` VARCHAR(191) NOT NULL,
    MODIFY `age` INTEGER NULL,
    MODIFY `gender` VARCHAR(191) NULL;
