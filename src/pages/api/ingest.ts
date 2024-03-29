import { createHash } from "crypto";
import { NextApiRequest, NextApiResponse } from "next";
import { z } from "zod";
import { db } from "~/lib/db";
import Cors from "cors";
import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";
import { NextResponse } from "next/server";
import { startOfMonth } from "date-fns";

const LIMIT_EVENTS_HOBBY = 2000;
const LIMIT_EVENTS_PRO = 10000;

const ratelimit = new Ratelimit({
  redis: Redis.fromEnv(),
  analytics: true,
  limiter: Ratelimit.fixedWindow(10, "1s"),
});

const bodyObject = z.object({
  channel: z.string(),
  name: z.string(),
  description: z.string().optional(),
  user: z.string().optional(),
});

const cors = Cors({
  methods: ["POST", "OPTIONS"],
  origin: "*",
});

function runMiddleware(
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
    await runMiddleware(req, res, cors);

    const key = req.headers["x-obsolog-token"] as string | undefined;

    if (!key) {
      return res
        .status(401)
        .send("The event should have an x-obsolog-token header");
    }

    const limit = await ratelimit.limit(key);
    if (!limit.success) {
      return NextResponse.json(
        { error: "Too many requests" },
        {
          status: 429,
          headers: {
            "RateLimit-Limit": limit.limit.toString(),
            "RateLimit-Remaining": limit.remaining.toString(),
            "RateLimit-Reset": limit.reset.toString(),
          },
        }
      );
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

    const monthStart = startOfMonth(new Date());

    const numOfEvents = await db.event.aggregate({
      _count: {
        id: true,
      },
      where: {
        tenantId: apiKey.tenantId,
        createdAt: {
          gt: monthStart,
        },
      },
    });

    if (
      apiKey.tenant.plan === "HOBBY" &&
      numOfEvents._count.id > LIMIT_EVENTS_HOBBY
    ) {
      return res.status(402).send("Exceeded limit for Hobby plan");
    } else if (
      apiKey.tenant.plan === "PRO" &&
      numOfEvents._count.id > LIMIT_EVENTS_PRO
    ) {
      return res.status(402).send("Exceeded limit for Pro plan. Contact sales");
    }

    await db.event.create({
      data: {
        apiKeyId: apiKey.id,
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
