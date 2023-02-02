-- CreateTable
CREATE TABLE "Factor" (
    "id" STRING NOT NULL,
    "name" STRING NOT NULL,
    "weight" INT4 NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Factor_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_DiseaseToFactor" (
    "A" STRING NOT NULL,
    "B" STRING NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "Factor_name_key" ON "Factor"("name");

-- CreateIndex
CREATE UNIQUE INDEX "_DiseaseToFactor_AB_unique" ON "_DiseaseToFactor"("A", "B");

-- CreateIndex
CREATE INDEX "_DiseaseToFactor_B_index" ON "_DiseaseToFactor"("B");

-- AddForeignKey
ALTER TABLE "_DiseaseToFactor" ADD CONSTRAINT "_DiseaseToFactor_A_fkey" FOREIGN KEY ("A") REFERENCES "Disease"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_DiseaseToFactor" ADD CONSTRAINT "_DiseaseToFactor_B_fkey" FOREIGN KEY ("B") REFERENCES "Factor"("id") ON DELETE CASCADE ON UPDATE CASCADE;
