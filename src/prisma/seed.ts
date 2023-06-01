import { faker } from "@faker-js/faker";
import { v4 as uuid } from "uuid";
import { db } from "~/lib/db";

const TENANT_ID = "user_2QbSg4p5VRNxCgL1n6WZGAPjUkp" as const;
const API_KEYS = [
  "54727704fa022d74c4a6229414d44f5b8928598a8f3690a9d4905e8dba390834",
  "f3db0cfb839d10191795f72f8bf8cc0f769623f0bdae9b210b37f0e0f294c440",
] as const;
const CHANNELS = [
  {
    id: "clid36fak0003ml08c0w1nmrq",
    messages: ["User Created", "User Updated", "User Deleted"],
  },
  {
    id: "clid36lje0007ml08wg5312eq",
    messages: [
      "GET /api/unicorns",
      "POST /api/unicorn/new",
      "PATCH /api/my-unicorn",
    ],
  },
  {
    id: "clid36ixr0005ml08npcez3pe",
    messages: [
      "Subscription Created",
      "Subscription Updated",
      "Subscription Canceled",
    ],
  },
] as const;

async function main() {
  const tenant = TENANT_ID;

  for (let i = 0; i < 12000; ++i) {
    const date = faker.date.between({ from: "2023-05-15", to: "2023-05-31" });
    const randomProjectIdx = faker.number.int({ min: 0, max: 1 });
    const apiKey = API_KEYS[randomProjectIdx];

    const randomChannelIdx = faker.number.int({ min: 0, max: 2 });
    const randomMessageIdx = faker.number.int({ min: 0, max: 2 });

    const channelId = CHANNELS[randomChannelIdx].id;
    const eventMessage = CHANNELS[randomChannelIdx].messages[randomMessageIdx];

    const userId = uuid();

    await db.event.create({
      data: {
        apiKeyId: apiKey,
        name: eventMessage,
        user: userId,
        channelId: channelId,
        tenantId: tenant,
        createdAt: date,
      },
    });
  }
}

main()
  .then(async () => {
    await db.$disconnect();
  })
  .catch(async (err) => {
    console.error(err);
    await db.$disconnect();
    process.exit(1);
  });
