/*
  Warnings:

  - Added the required column `title` to the `AIInsight` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "AIInsight" ADD COLUMN     "title" TEXT NOT NULL;
