import { createHash } from "crypto";
import { NextApiRequest, NextApiResponse } from "next";
import { z } from "zod";
import { db } from "~/lib/db";
import Cors from "cors";

const bodyObject = z.object({
  channel: z.string(),
  name: z.string(),
  description: z.string().optional(),
  user: z.string().optional(),
});

const cors = Cors({
  methods: ["POST", 'OPTIONS'],
  origin: "*",
  
});

function runCorsMiddleware(
  req: NextApiRequest,
  res: NextApiResponse,
  fn: Function
) {
  return new Promise((resolve, reject) => {
    fn(req, res, (result: any) => {
      if (result instanceof Error) {
        return reject(result);
      }

      return resolve(result);
    });
  });
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    await runCorsMiddleware(req, res, cors);

    const key = req.headers["x-obsolog-token"] as string | undefined;

    if (!key) {
      return res
        .status(401)
        .send("The event should have an x-obsolog-token header");
    }

    const body = req.body;

    const bodyParsed = bodyObject.safeParse(body);
    if (!bodyParsed.success) {
      console.error(bodyParsed.error.message);
      return res.status(400).send(bodyParsed.error.message);
    }

    const apiKey = await db.apiKey.findUnique({
      include: {
        tenant: true,
      },
      where: {
        id: createHash("sha256").update(key).digest("hex"),
      },
    });

    if (!apiKey) {
      return res.status(404).send("Could not find API KEY");
    }

    const channel = await db.channel.findFirst({
      where: {
        AND: {
          tenantId: apiKey.tenantId,
          name: bodyParsed.data.channel,
        },
      },
    });

    if (!channel) {
      return res.status(404).send("Could not find channel");
    }

    await db.event.create({
      data: {
        name: bodyParsed.data.name,
        description: bodyParsed.data.description,
        user: bodyParsed.data.user,
        channelId: channel.id,
        tenantId: apiKey.tenantId,
      },
    });

    return res.status(200).send("Success");
  } catch (err) {
    console.error(err);
    return res.status(500).send("Something went wrong...");
  }
}
