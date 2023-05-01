import { Webhook } from "svix";
import { buffer } from "micro";
import { z } from "zod";
import { NextApiRequest, NextApiResponse } from "next";
import { env } from "~/lib/env.js";
import { db } from "~/lib/db";

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
      username: z.string(),
      created_at: z.number(),
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
        await db.tenant.create({
          data: {
            id: parsed.data.data.id,
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
