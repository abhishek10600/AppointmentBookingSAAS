/*
  Warnings:

  - Added the required column `accountNumberLast4` to the `BankDetail` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "BankDetail" ADD COLUMN     "accountNumberLast4" TEXT NOT NULL;
