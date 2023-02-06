import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "../trpc";

export const userRouter = createTRPCRouter({
  list: protectedProcedure.query(({ ctx }) => {
    if (ctx.session.user.role !== "OWNER") return;

    const users = ctx.prisma.user.findMany();

    return users;
  }),
  promote: protectedProcedure
    .input(
      z.object({
        userId: z.string(),
      })
    )
    .mutation(({ ctx, input }) => {
      if (ctx.session.user.role !== "OWNER") return;

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
  demote: protectedProcedure
    .input(
      z.object({
        userId: z.string(),
      })
    )
    .mutation(({ ctx, input }) => {
      if (ctx.session.user.role !== "OWNER") return;

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
