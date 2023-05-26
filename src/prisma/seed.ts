import { faker } from "@faker-js/faker";
import { v4 as uuid } from "uuid";
import { db } from "~/lib/db";

const TENANT_ID = "user_2QKkPyMQFsTChgsAGawJLSl75di" as const;
const API_KEYS = [
  "465c2248c8ef0c6193d1ea481e060619a3969478f0040ce12bb2e95d19d0b567",
  "762f3f4beae0960be1b618f2f4ee8c3ef10dc2849200686e6ad6b20f90b47fb2",
] as const;
const CHANNELS = [
  {
    id: "cli4mtn3s0005if08ull8e7g1",
    messages: ["User Created", "User Updated", "User Deleted"],
  },
  {
    id: "cli4mtrf60007if08ce4yt855",
    messages: [
      "GET /api/unicorns",
      "POST /api/unicorn/new",
      "PATCH /api/my-unicorn",
    ],
  },
  {
    id: "cli4mtvcp0009if08ikhxenkr",
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
    const date = faker.date.between({ from: "2023-05-01", to: "2023-05-31" });
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
