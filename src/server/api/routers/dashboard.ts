import { adminProcedure, createTRPCRouter } from "../trpc";

export const dashboardRouter = createTRPCRouter({
  count: adminProcedure.query(async ({ ctx }) => {
    const diseasesCount = await ctx.prisma.disease.count();
    const symptomsCount = await ctx.prisma.symptom.count();
    const factorsCount = await ctx.prisma.factor.count();

    return {
      diseasesCount,
      symptomsCount,
      factorsCount,
    };
  }),
});
