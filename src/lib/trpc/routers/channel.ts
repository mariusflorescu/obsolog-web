import { TRPCError } from "@trpc/server";
import { auth, t } from "../trpc";
import { db } from "~/lib/db";

export const channelRouter = t.router({
  get: t.procedure.use(auth).query(async ({ ctx }) => {
    if (!ctx.tenant?.id) {
      throw new TRPCError({
        code: "BAD_REQUEST",
        message: "Project actions require a tenant",
      });
    }

    return db.channel.findMany({
      where: {
        tenantId: ctx.tenant.id,
      },
    });
  }),
});
