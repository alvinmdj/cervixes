import { z } from "zod";
import { createTRPCRouter, ownerProcedure } from "../trpc";

export const userRouter = createTRPCRouter({
  list: ownerProcedure.query(({ ctx }) => {
    const users = ctx.prisma.user.findMany();

    return users;
  }),
  promote: ownerProcedure
    .input(
      z.object({
        userId: z.string(),
      })
    )
    .mutation(({ ctx, input }) => {
      const { userId } = input;

      return ctx.prisma.user.update({
        data: {
          role: "ADMIN",
        },
        where: {
          id: userId,
        },
      });
    }),
  demote: ownerProcedure
    .input(
      z.object({
        userId: z.string(),
      })
    )
    .mutation(({ ctx, input }) => {
      const { userId } = input;

      return ctx.prisma.user.update({
        data: {
          role: "USER",
        },
        where: {
          id: userId,
        },
      });
    }),
});
