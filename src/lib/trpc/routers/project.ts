import { TRPCError } from "@trpc/server";
import { format, sub } from "date-fns";
import { groupBy } from "lodash";
import { z } from "zod";
import { db } from "~/lib/db";
import { auth, t } from "../trpc";

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
  getProject: t.procedure
    .use(auth)
    .input(z.object({ id: z.string() }))
    .query(async ({ ctx, input }) => {
      if (!ctx.tenant?.id) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Project actions require a tenant",
        });
      }

      return await db.project.findUnique({
        select: {
          id: true,
          name: true,
          url: true,
          description: true,
          createdAt: true,
        },
        where: {
          id: input.id,
        },
      });
    }),
  getProjectActivity: t.procedure
    .use(auth)
    .input(z.object({ id: z.string(), from: z.number() }))
    .query(async ({ ctx, input }) => {
      if (!ctx.tenant?.id) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Project actions require a tenant",
        });
      }

      const from = sub(Date.now(), {
        days: input.from,
      });

      const projectApiKeys = await db.apiKey.findMany({
        where: {
          projectId: input.id,
        },
      });
      const apiKeysIds = projectApiKeys.map((key) => key.id);
      const apiKeysNames = projectApiKeys.map((key) => key.name);
      const parsedKeys = apiKeysIds.map((k) => `'${k}'`);
      const apiKeysClause = `(${parsedKeys.join(", ")})`;

      const events = await db.event.findMany({
        where: {
          apiKeyId: {
            in: apiKeysIds,
          },
          createdAt: {
            gt: from,
          },
        },
        orderBy: [
          {
            createdAt: "desc",
          },
        ],
      });

      const query = `SELECT COUNT(DATE(e.createdAt)) as numberOfEvents, DATE(e.createdAt) as createdAt, ak.name as keyName from obsolog.\`Event\` e INNER JOIN obsolog.\`ApiKey\` ak ON ak.id=e.apiKeyId WHERE e.createdAt > "${format(
        from,
        "yyyy-MM-dd HH:mm:ss"
      )}" AND ak.id IN ${apiKeysClause} GROUP BY DATE(e.createdAt), ak.name ORDER BY DATE(e.createdAt) ASC`;
      const rawSeries = (await db.$queryRawUnsafe(query)) as {
        numberOfEvents: bigint;
        createdAt: Date;
        keyName: string;
      }[];
      const parsedSeries = rawSeries.map((entry) => ({
        "Number of Events": Number(entry.numberOfEvents),
        "Key Name": entry.keyName,
        createdAt: format(entry.createdAt, "dd/MM/yyyy"),
      }));

      const groupedSeries = groupBy(
        parsedSeries,
        (tmpSeries) => tmpSeries["createdAt"]
      );
      const groupedSeriesKeys = Object.keys(groupedSeries);
      const groupedSeriesParsed = groupedSeriesKeys.map((k) => {
        const createdAt = k;
        const entriesForDate = groupedSeries[k];

        const values = apiKeysNames.reduce(
          (prev, acc) => ({
            ...prev,
            [acc]:
              entriesForDate.find((v) => v["Key Name"] === acc)?.[
                "Number of Events"
              ] ?? 0,
          }),
          {}
        );

        return {
          createdAt,
          ...values,
        };
      });

      return {
        series: groupedSeriesParsed,
        events,
        keyNames: apiKeysNames,
      };
    }),
  update: t.procedure
    .use(auth)
    .input(
      z.object({
        id: z.string(),
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

      await db.project.update({
        data: {
          name: input.name,
          url: input.url,
          description: input.description,
        },
        where: {
          id: input.id,
        },
      });

      return {
        success: true,
      };
    }),
  deleteProject: t.procedure
    .use(auth)
    .input(z.object({ projectId: z.string() }))
    .mutation(async ({ ctx, input }) => {
      if (!ctx.tenant?.id) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Project actions require a tenant",
        });
      }

      await db.project.delete({
        where: {
          id: input.projectId,
        },
      });

      return {
        success: true,
      };
    }),
});
