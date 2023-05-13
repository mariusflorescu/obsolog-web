import { TRPCError } from "@trpc/server";
import { auth, t } from "../trpc";
import { db } from "~/lib/db";
import { z } from "zod";

export const channelRouter = t.router({
  get: t.procedure.use(auth).query(async ({ ctx }) => {
    if (!ctx.tenant?.id) {
      throw new TRPCError({
        code: "BAD_REQUEST",
        message: "Channel actions require a tenant",
      });
    }

    return db.channel.findMany({
      select: {
        id: true,
        name: true,
      },
      where: {
        tenantId: ctx.tenant.id,
      },
    });
  }),
  create: t.procedure
    .use(auth)
    .input(
      z.object({
        name: z.string().regex(/^[a-z\.]+$/),
      })
    )
    .mutation(async ({ ctx, input }) => {
      if (!ctx.tenant?.id) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Channel actions require a tenant",
        });
      }

      await db.channel.create({
        data: {
          name: input.name,
          tenantId: ctx.tenant.id,
        },
      });

      return {
        success: true,
      };
    }),
  getChannel: t.procedure
    .use(auth)
    .input(z.object({ id: z.string() }))
    .query(async ({ ctx, input }) => {
      if (!ctx.tenant?.id) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Channel actions require a tenant",
        });
      }

      return db.channel.findUnique({
        select: {
          name: true,
          createdAt: true,
        },
        where: {
          id: input.id,
        },
      });
    }),
  update: t.procedure
    .use(auth)
    .input(z.object({ id: z.string(), name: z.string().regex(/^[a-z\.]+$/) }))
    .mutation(async ({ ctx, input }) => {
      if (!ctx.tenant?.id) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Channel actions require a tenant",
        });
      }

      await db.channel.update({
        data: {
          name: input.name,
        },
        where: {
          id: input.id,
        },
      });

      return {
        success: true,
      };
    }),
  deleteChannel: t.procedure
    .use(auth)
    .input(z.object({ id: z.string() }))
    .mutation(async ({ ctx, input }) => {
      if (!ctx.tenant?.id) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Channel actions require a tenant",
        });
      }

      await db.channel.delete({
        where: {
          id: input.id,
        },
      });

      return {
        success: true,
      };
    }),
});
