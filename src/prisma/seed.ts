import { faker } from "@faker-js/faker";
import { v4 as uuid } from "uuid";
import { db } from "~/lib/db";

const TENANT_ID = "user_2PjRZEDyTMzAXB42Mu9jrUGrZbf";
const CHANNEL_ID = "cli378pev0001vl56rhr7bd41";
const EVENT_NAME = "User Created";

async function main() {
  for (let i = 0; i < 600; ++i) {
    const date = faker.date.between({ from: "2023-04-01", to: "2023-05-31" });
    const id = uuid();

    await db.event.create({
      data: {
        name: EVENT_NAME,
        user: id,
        channelId: CHANNEL_ID,
        tenantId: TENANT_ID,
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
