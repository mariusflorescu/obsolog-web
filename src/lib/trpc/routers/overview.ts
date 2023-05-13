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

    return {
      numOfProjects: numOfProjects._count.id || 0,
      numOfChannels: numOfChannels._count.id || 0,
    };
  }),
});
