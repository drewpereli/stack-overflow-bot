/*
  Warnings:

  - You are about to drop the column `description` on the `Question` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Question" DROP COLUMN "description",
ADD COLUMN     "content" TEXT;
