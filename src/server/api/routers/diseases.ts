import { Prisma } from "@prisma/client";
import { z } from "zod";
import { addDiseaseSchema } from "../../../components/Modal/ModalAddDisease";
import { editDiseaseSchema } from "../../../components/Modal/ModalEditDisease";
import { createTRPCRouter, protectedProcedure } from "../trpc";

export const diseaseRouter = createTRPCRouter({
  create: protectedProcedure
    .input(addDiseaseSchema)
    .mutation(async ({ ctx, input }) => {
      try {
        const { name } = input;

        const disease = await ctx.prisma.disease.create({
          data: { name },
        });

        return disease;
      } catch (error) {
        if (error instanceof Prisma.PrismaClientKnownRequestError) {
          if (error.code === "P2002") {
            throw (error.message = "Nama penyakit sudah ada");
          }
        }
        throw error;
      }
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
  update: protectedProcedure
    .input(editDiseaseSchema)
    .mutation(async ({ ctx, input }) => {
      try {
        const { id, name } = input;

        const updatedDisease = await ctx.prisma.disease.update({
          data: { name },
          where: { id },
        });

        return updatedDisease;
      } catch (error) {
        if (error instanceof Prisma.PrismaClientKnownRequestError) {
          if (error.code === "P2002") {
            throw (error.message = "Nama penyakit sudah ada");
          }
        }
        throw error;
      }
    }),
  delete: protectedProcedure
    .input(
      z.object({
        diseaseId: z.string(),
      })
    )
    .mutation(({ ctx, input }) => {
      const { diseaseId } = input;

      return ctx.prisma.disease.delete({
        where: {
          id: diseaseId,
        },
      });
    }),
});
