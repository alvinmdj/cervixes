import { diseaseRouter } from "./routers/disease";
import { createTRPCRouter } from "./trpc";

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here
 */
export const appRouter = createTRPCRouter({
  diseases: diseaseRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
