import { diseaseRouter } from "./routers/diseases";
import { factorRouter } from "./routers/factors";
import { symptomRouter } from "./routers/symptoms";
import { userRouter } from "./routers/users";
import { createTRPCRouter } from "./trpc";

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here
 */
export const appRouter = createTRPCRouter({
  diseases: diseaseRouter,
  factors: factorRouter,
  symptoms: symptomRouter,
  users: userRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
