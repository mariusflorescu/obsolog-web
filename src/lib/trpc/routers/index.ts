import { t } from "../trpc";
import { apiKeyRouter } from "./api-key";
import { channelRouter } from "./channel";
import { overviewRouter } from "./overview";
import { projectRouter } from "./project";
import { tenantRouter } from "./tenant";

export const router = t.router({
  tenant: tenantRouter,
  overview: overviewRouter,
  project: projectRouter,
  channel: channelRouter,
  apiKey: apiKeyRouter,
});

export type Router = typeof router;
