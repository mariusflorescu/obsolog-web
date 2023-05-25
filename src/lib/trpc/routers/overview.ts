import { TRPCError } from "@trpc/server";
import { db } from "~/lib/db";
import { auth, t } from "../trpc";

export const overviewRouter = t.router({
  get: t.procedure.use(auth).query(async ({ ctx }) => {
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
    const numOfChannels = await db.channel.aggregate({
      _count: {
        id: true,
      },
      where: {
        tenantId: ctx.tenant.id,
      },
    });
    const numOfApiKeys = await db.apiKey.aggregate({
      _count: {
        id: true,
      },
      where: {
        tenantId: ctx.tenant.id,
      },
    });
    const barSeries =
      (await db.$queryRaw`SELECT COUNT(e.id) as numberOfEvents, c.name as channelName FROM obsolog.\`Event\` e INNER JOIN obsolog.\`Channel\` c ON c.id = e.channelId GROUP BY c.id;`) as {
        numberOfEvents: BigInt;
        channelName: string;
      }[];

    return {
      numOfProjects: numOfProjects._count.id || 0,
      numOfChannels: numOfChannels._count.id || 0,
      numOfApiKeys: numOfApiKeys._count.id || 0,
      barSeries: barSeries.map((entry) => ({
        "Number of Events": Number(entry.numberOfEvents),
        "Channel Name": entry.channelName,
      })),
    };
  }),
});
