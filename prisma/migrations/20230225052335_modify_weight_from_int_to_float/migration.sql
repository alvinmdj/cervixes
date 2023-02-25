/*
  Warnings:

  - Changed the type of `weight` on the `Factor` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `weight` on the `Symptom` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- AlterTable
ALTER TABLE "Factor" DROP COLUMN "weight";
ALTER TABLE "Factor" ADD COLUMN     "weight" FLOAT8 NOT NULL;

-- AlterTable
ALTER TABLE "Symptom" DROP COLUMN "weight";
ALTER TABLE "Symptom" ADD COLUMN     "weight" FLOAT8 NOT NULL;
