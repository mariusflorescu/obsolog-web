import { NextApiRequest, NextApiResponse } from "next";
import stripe from "~/lib/stripe";
import { buffer } from "micro";
import { db } from "~/lib/db";
import { z } from "zod";

export const config = {
  api: {
    bodyParser: false,
  },
};

const body = z.discriminatedUnion("type", [
  z.object({
    type: z.literal("customer.subscription.created"),
    data: z.object({
      object: z.object({
        id: z.string(),
        customer: z.string(),
      }),
    }),
  }),
  z.object({
    type: z.literal("customer.subscription.deleted"),
    data: z.object({
      object: z.object({
        id: z.string(),
        customer: z.string(),
      }),
    }),
  }),
]);

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  const signature = req.headers["stripe-signature"];
  const signingSecret = process.env.STRIPE_SIGNING_SECRET;
  const reqBuffer = await buffer(req);

  let event;
  try {
    //@ts-ignore
    event = stripe.webhooks.constructEvent(reqBuffer, signature, signingSecret);
  } catch (err) {
    console.log(err);
    return res.status(400).send(`Webhook error`);
  }

  const parsed = body.safeParse(event);

  if (!parsed.success) {
    console.error(parsed.error.message);
    return res.status(400).send(parsed.error.message);
  }

  switch (parsed.data.type) {
    case "customer.subscription.created":
      await db.tenant.update({
        where: {
          stripeCustomerId: parsed.data.data.object.customer,
        },
        data: {
          plan: "PRO",
        },
      });
      return res.status(201).send(`Stripe Webhook - Subscription Created`);
    case "customer.subscription.deleted":
      await db.tenant.update({
        where: {
          stripeCustomerId: parsed.data.data.object.customer,
        },
        data: {
          plan: "HOBBY",
        },
      });
      return res.status(200).send(`Stripe Webhook - Subscription Deleted`);
  }
};

export default handler;
