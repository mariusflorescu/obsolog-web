import { TRPCError } from "@trpc/server";
import { auth, t } from "../trpc";
import { db } from "~/lib/db";
import stripe from "~/lib/stripe";
import console from "console";

export const tenantRouter = t.router({
  getCurrentTenant: t.procedure.use(auth).query(async ({ ctx }) => {
    if (!ctx.tenant?.id) {
      throw new TRPCError({
        code: "BAD_REQUEST",
        message: "Project actions require a tenant",
      });
    }
    const tenant = await db.tenant.findUnique({
      where: {
        id: ctx.tenant.id,
      },
    });

    if (tenant?.plan === "HOBBY") {
      const { data: subs } = await stripe.prices.list();
      const sub = await stripe.products.retrieve(subs[0].product as string);
      const stripeSession = await stripe.checkout.sessions.create({
        customer: tenant.stripeCustomerId as string,
        mode: "subscription",
        payment_method_types: ["card"],
        line_items: [{ price: sub.id, quantity: 1 }],
        success_url: process.env.VERCEL_URL
          ? "https://obsolog.vercel.app/dashboard/overview"
          : "http://localhost:3000/dashboard/overview",
        cancel_url: process.env.VERCEL_URL
          ? "https://obsolog.vercel.app/dashboard/overview"
          : "http://localhost:3000/dashboard/overview",
      });

      return {
        tenant,
        stripeSessionId: stripeSession.id,
      };
    }

    return {
      tenant,
    };
  }),
});
