import { db } from "~/lib/db";
import { auth, t } from "../trpc";
import { z } from "zod";
import { TRPCError } from "@trpc/server";

export const projectRouter = t.router({
  create: t.procedure
    .use(auth)
    .input(
      z.object({
        name: z.string(),
        url: z.string().url(),
        description: z.string().nullable(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      if (!ctx.tenant?.id) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Project actions require a tenant",
        });
      }

      await db.project.create({
        data: {
          name: input.name,
          url: input.url,
          description: input.description,
          tenantId: ctx.tenant.id,
        },
      });

      return {
        success: true,
      };
    }),
  get: t.procedure.use(auth).query(async ({ ctx }) => {
    if (!ctx.tenant?.id) {
      throw new TRPCError({
        code: "BAD_REQUEST",
        message: "Project actions require a tenant",
      });
    }

    return db.project.findMany({
      select: {
        id: true,
        url: true,
        name: true,
        description: true,
      },
      where: {
        tenantId: ctx.tenant.id,
      },
    });
  }),
  overview: t.procedure.use(auth).query(async ({ ctx }) => {
    if (!ctx.tenant?.id) {
      throw new TRPCError({
        code: "BAD_REQUEST",
        message: "Project actions require a tenant",
      });
    }

    const numOfProjects = await db.project.aggregate({
      _count: {
        id: true,
      },
      where: {
        tenantId: ctx.tenant.id,
      },
    });

    return {
      numOfProjects: numOfProjects._count.id,
    };
  }),
});
