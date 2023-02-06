import { Prisma } from "@prisma/client";
import { addSymptomSchema } from "components/Modal/ModalAddSymptom";
import { editSymptomSchema } from "components/Modal/ModalEditSymptom";
import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "../trpc";

export const symptomRouter = createTRPCRouter({
  create: protectedProcedure
    .input(addSymptomSchema)
    .mutation(async ({ ctx, input }) => {
      try {
        const { name, weight, diseases } = input;

        const symptom = await ctx.prisma.symptom.create({
          data: {
            name,
            weight,
            diseases: {
              connect: diseases.map((id) => ({
                id,
              })),
            },
          },
        });

        return symptom;
      } catch (error) {
        if (error instanceof Prisma.PrismaClientKnownRequestError) {
          if (error.code === "P2002") {
            throw (error.message = "This name is already exists");
          }
        }
        throw error;
      }
    }),
  list: protectedProcedure.query(({ ctx }) => {
    const symptoms = ctx.prisma.symptom.findMany({
      include: {
        diseases: true,
      },
    });

    return symptoms;
  }),
  update: protectedProcedure
    .input(editSymptomSchema)
    .mutation(async ({ ctx, input }) => {
      try {
        const { id, name, weight, diseases } = input;

        const updatedSymptom = await ctx.prisma.symptom.update({
          data: {
            name,
            weight,
            diseases: {
              connect: diseases.map((id) => ({
                id,
              })),
            },
          },
          where: { id },
        });

        return updatedSymptom;
      } catch (error) {
        if (error instanceof Prisma.PrismaClientKnownRequestError) {
          if (error.code === "P2002") {
            throw (error.message = "This name is already exists");
          }
        }
        throw error;
      }
    }),
  delete: protectedProcedure
    .input(
      z.object({
        symptomId: z.string(),
      })
    )
    .mutation(({ ctx, input }) => {
      const { symptomId } = input;

      return ctx.prisma.symptom.delete({
        where: {
          id: symptomId,
        },
      });
    }),
});
