import { Prisma } from "@prisma/client";
import { TRPCError } from "@trpc/server";
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

        // check if symptom with same disease already exist
        const isExist = await ctx.prisma.symptom.findFirst({
          where: {
            name: {
              equals: name,
              mode: "insensitive",
            },
            diseases: {
              some: {
                id: {
                  in: diseases,
                },
              },
            },
          },
          include: {
            diseases: true,
          },
        });

        // throw error if exists
        if (isExist) {
          const isExistDiseaseNames = isExist.diseases
            .map((disease) => disease.name)
            .join(", ");

          throw new TRPCError({
            code: "BAD_REQUEST",
            message: `Gejala dengan penyakit yang sama (${isExistDiseaseNames}) sudah ada.`,
          });
        }

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
            throw (error.message = "Nama sudah digunakan");
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

        // check if symptom with same disease already exist
        const isExist = await ctx.prisma.symptom.findFirst({
          where: {
            // make sure the existing is not the current factor ID
            id: {
              not: id,
            },
            name: {
              equals: name,
              mode: "insensitive",
            },
            diseases: {
              some: {
                id: {
                  in: diseases,
                },
              },
            },
          },
          include: {
            diseases: true,
          },
        });

        // throw error if exists
        if (isExist) {
          const isExistDiseaseNames = isExist.diseases
            .map((disease) => disease.name)
            .join(", ");

          throw new TRPCError({
            code: "BAD_REQUEST",
            message: `Gejala dengan penyakit yang sama (${isExistDiseaseNames}) sudah ada.`,
          });
        }

        // get previous connected diseases
        const previousDiseases = await ctx.prisma.symptom
          .findUnique({
            where: { id },
          })
          .diseases();

        // filter diseases other than the currently selected diseases
        const previousDiseasesIds = previousDiseases
          ?.map((prevDisease) => prevDisease.id)
          .filter((id) => !diseases.includes(id));

        const updatedSymptom = await ctx.prisma.symptom.update({
          data: {
            name,
            weight,
            diseases: {
              disconnect: previousDiseasesIds?.map((id) => ({
                id,
              })),
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
            throw (error.message = "Nama sudah digunakan");
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
