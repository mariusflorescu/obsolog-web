import { TRPCError } from "@trpc/server";
import { auth, t } from "../trpc";
import { db } from "~/lib/db";
import { z } from "zod";
import { format, sub } from "date-fns";
import input from "postcss/lib/input";

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
  channelActivity: t.procedure
    .use(auth)
    .input(
      z.object({
        id: z.string().optional().nullable(),
        from: z.number().positive(),
      })
    )
    .query(async ({ ctx, input }) => {
      if (!ctx.tenant?.id || !input.id) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Channel actions require a tenant",
        });
      }

      const from = sub(Date.now(), {
        days: input.from,
      });

      const events = await db.event.findMany({
        include: {
          channel: {
            select: {
              name: true,
            },
          },
        },
        where: {
          channelId: input.id,
          tenantId: ctx.tenant.id,
          createdAt: {
            gt: from,
          },
        },
      });
      const series =
        (await db.$queryRaw`SELECT COUNT(DATE(createdAt)) as numberOfEvents, DATE(createdAt) as createdAt FROM obsolog.\`Event\` WHERE createdAt > ${from} AND channelId = ${input.id} GROUP BY DATE(createdAt)`) as {
          numberOfEvents: BigInt;
          createdAt: Date;
        }[];

      return {
        series: series.map((entry) => ({
          "Number of Events": Number(entry.numberOfEvents),
          createdAt: format(entry.createdAt, "dd-MM-yyyy"),
        })),
        events,
      };
    }),
});
