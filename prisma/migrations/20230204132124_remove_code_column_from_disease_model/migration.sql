/*
  Warnings:

  - You are about to drop the column `code` on the `Disease` table. All the data in the column will be lost.

*/
-- DropIndex
DROP INDEX "Disease_code_key";

-- AlterTable
ALTER TABLE "Disease" DROP COLUMN "code";
