import { createTRPCRouter, publicProcedure } from "../trpc";

export const diagnoseRouter = createTRPCRouter({
  getOptions: publicProcedure.query(async ({ ctx }) => {
    const symptoms = await ctx.prisma.symptom.findMany({
      select: {
        id: true,
        name: true,
        weight: true,
        diseases: {
          select: {
            name: true,
          },
        },
      },
    });

    // divide weight by 10 and flatten the disease name
    const formattedSymptoms = symptoms.map((symptom) => {
      const diseaseNames = symptom.diseases.map((disease) => disease.name);
      return {
        ...symptom,
        weight: symptom.weight / 10,
        diseases: diseaseNames,
      };
    });

    const factors = await ctx.prisma.factor.findMany({
      select: {
        id: true,
        name: true,
        weight: true,
        diseases: {
          select: {
            name: true,
          },
        },
      },
    });

    // divide weight by 10 and flatten the disease name
    const formattedFactors = factors.map((factor) => {
      const diseaseNames = factor.diseases.map((disease) => disease.name);
      return {
        ...factor,
        weight: factor.weight / 10,
        diseases: diseaseNames,
      };
    });

    return {
      symptoms: formattedSymptoms,
      factors: formattedFactors,
    };
  }),
});
