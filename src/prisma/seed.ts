import { faker } from "@faker-js/faker";
import { v4 as uuid } from "uuid";
import { db } from "~/lib/db";

const TENANT_ID = "user_2PjRZEDyTMzAXB42Mu9jrUGrZbf";
const CHANNEL_ID = "clhx9kyl80001vlz2scbg1p4a";
const EVENT_NAME = "User Created";

async function main() {
  console.log("Starting seed");

  for (let i = 0; i < 300; ++i) {
    const date = faker.date.between({ from: "2023-04-01", to: "2023-05-21" });
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

  console.log("Finished seed");
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
