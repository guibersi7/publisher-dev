import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "@/server/trpc";

export const appRouter = createTRPCRouter({
  healthcheck: publicProcedure.query(() => ({ status: "ok" })),
  chatPreview: publicProcedure
    .input(z.object({ prompt: z.string().min(1) }))
    .mutation(({ input }) => ({
      reply: `Recebemos: ${input.prompt}. Em breve, conectaremos com a IA.`
    }))
});

export type AppRouter = typeof appRouter;
