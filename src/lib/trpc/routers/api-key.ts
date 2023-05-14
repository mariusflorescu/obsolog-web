import { TRPCError } from "@trpc/server";
import { t } from "../trpc";
import { db } from "~/lib/db";
import { z } from "zod";
import { v4 as UUID } from "uuid";
import { createHash } from "crypto";

export const apiKeyRouter = t.router({
  get: t.procedure.query(async ({ ctx }) => {
    if (!ctx.tenant?.id) {
      throw new TRPCError({
        code: "BAD_REQUEST",
        message: "API Keys actions require a tenant",
      });
    }

    return db.apiKey.findMany({
      select: {
        id: true,
        name: true,
        description: true,
        environment: true,
        project: {
          select: {
            name: true,
          },
        },
        createdAt: true,
        updatedAt: true,
      },
      where: {
        tenantId: ctx.tenant.id,
      },
    });
  }),
  create: t.procedure
    .input(
      z.object({
        name: z.string(),
        description: z.string().nullable(),
        environment: z.enum(["DEVELOPMENT", "STAGING", "PRODUCTION"]),
        projectId: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      if (!ctx.tenant?.id) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "API Keys actions require a tenant",
        });
      }

      const API_KEY = UUID().replace("-", "");

      await db.apiKey.create({
        data: {
          id: createHash("sha256").update(API_KEY).digest("hex"),
          name: input.name,
          description: input.description,
          environment: input.environment,
          projectId: input.projectId,
          tenantId: ctx.tenant.id,
        },
      });

      return {
        apiKey: API_KEY,
      };
    }),
  initialRevoke: t.procedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ ctx, input }) => {
      if (!ctx.tenant?.id) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "API Keys actions require a tenant",
        });
      }

      await db.apiKey.delete({
        where: {
          id: createHash("sha256").update(input.id).digest("hex"),
        },
      });

      return {
        success: true,
      };
    }),
  revoke: t.procedure
    .input(
      z.object({
        id: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      if (!ctx.tenant?.id) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "API Keys actions require a tenant",
        });
      }

      await db.apiKey.delete({
        where: {
          id: input.id,
        },
      });

      return {
        success: true,
      };
    }),
});
