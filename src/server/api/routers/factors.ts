import { Prisma } from "@prisma/client";
import { TRPCError } from "@trpc/server";
import { addFactorSchema } from "components/Modal/ModalAddFactor";
import { editFactorSchema } from "components/Modal/ModalEditFactor";
import { z } from "zod";
import { adminProcedure, createTRPCRouter } from "../trpc";

export const factorRouter = createTRPCRouter({
  create: adminProcedure
    .input(addFactorSchema)
    .mutation(async ({ ctx, input }) => {
      try {
        const { name, weight, diseases } = input;

        // check if factor with same disease already exist
        const isExist = await ctx.prisma.factor.findFirst({
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
            message: `Faktor dengan penyakit yang sama (${isExistDiseaseNames}) sudah ada.`,
          });
        }

        const factor = await ctx.prisma.factor.create({
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

        return factor;
      } catch (error) {
        if (error instanceof Prisma.PrismaClientKnownRequestError) {
          if (error.code === "P2002") {
            throw (error.message = "Nama sudah digunakan");
          }
        }
        throw error;
      }
    }),
  list: adminProcedure.query(({ ctx }) => {
    const factors = ctx.prisma.factor.findMany({
      include: {
        diseases: true,
      },
    });

    return factors;
  }),
  update: adminProcedure
    .input(editFactorSchema)
    .mutation(async ({ ctx, input }) => {
      try {
        const { id, name, weight, diseases } = input;

        // check if factor with same disease already exist
        const isExist = await ctx.prisma.factor.findFirst({
          where: {
            // make sure the existing is not the current symptom ID
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
            message: `Faktor dengan penyakit yang sama (${isExistDiseaseNames}) sudah ada.`,
          });
        }

        // get previous connected diseases
        const previousDiseases = await ctx.prisma.factor
          .findUnique({
            where: { id },
          })
          .diseases();

        // filter diseases other than the currently selected diseases
        const previousDiseasesIds = previousDiseases
          ?.map((prevDisease) => prevDisease.id)
          .filter((id) => !diseases.includes(id));

        const updatedFactor = await ctx.prisma.factor.update({
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

        return updatedFactor;
      } catch (error) {
        if (error instanceof Prisma.PrismaClientKnownRequestError) {
          if (error.code === "P2002") {
            throw (error.message = "Nama sudah digunakan");
          }
        }
        throw error;
      }
    }),
  delete: adminProcedure
    .input(
      z.object({
        factorId: z.string(),
      })
    )
    .mutation(({ ctx, input }) => {
      const { factorId } = input;

      return ctx.prisma.factor.delete({
        where: {
          id: factorId,
        },
      });
    }),
});
