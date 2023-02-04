import { addDiseaseSchema } from "../../../components/Modal/ModalAddDisease";
import { createTRPCRouter, protectedProcedure } from "../trpc";

export const diseaseRouter = createTRPCRouter({
  create: protectedProcedure
    .input(addDiseaseSchema)
    .mutation(({ ctx, input }) => {
      const { name } = input;

      const disease = ctx.prisma.disease.create({
        data: { name },
      });

      return disease;
    }),
  list: protectedProcedure.query(({ ctx }) => {
    const diseases = ctx.prisma.disease.findMany({
      include: {
        factors: true,
        symptoms: true,
      },
    });

    return diseases;
  }),
});