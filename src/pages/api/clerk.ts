import { Webhook } from "svix";
import { buffer } from "micro";
import { z } from "zod";
import { NextApiRequest, NextApiResponse } from "next";
import { env } from "~/lib/env";
import { db } from "~/lib/db";
import stripe from "~/lib/stripe";

export const config = {
  api: {
    bodyParser: false,
  },
};

const body = z.discriminatedUnion("type", [
  z.object({
    type: z.literal("user.created"),
    data: z.object({
      id: z.string(),
      username: z.string().nullable(),
      created_at: z.number(),
      email_addresses: z.array(
        z.object({
          email_address: z.string(),
        })
      ),
      first_name: z.string().nullable().optional(),
      last_name: z.string().nullable().optional(),
    }),
  }),
]);

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    const webhook = new Webhook(env.CLERK_WEBHOOK_KEY);
    const buf = (await buffer(req)).toString();

    const message = webhook.verify(buf, req.headers as any);
    const parsed = body.safeParse(message);
    if (!parsed.success) {
      console.error(parsed.error.message);
      return res.status(400).send(parsed.error.message);
    }

    switch (parsed.data.type) {
      case "user.created":
        const email_address = parsed.data.data.email_addresses[0].email_address;
        const full_name =
          parsed.data.data.first_name && parsed.data.data.last_name
            ? `${parsed.data.data.first_name} ${parsed.data.data.last_name}`
            : email_address;
        const customer = await stripe.customers.create({
          email: parsed.data.data.email_addresses[0].email_address,
          name: full_name,
        });
        await db.tenant.create({
          data: {
            id: parsed.data.data.id,
            stripeCustomerId: customer.id,
          },
        });
        break;
      default:
        console.error(`Unknown event ${parsed.data.type} sent.`);
    }

    return res.status(200).send("Success");
  } catch (err) {
    console.error(err);
    return res.status(500).send("Something went wrong...");
  }
}
