import { t } from "../trpc";
import { apiKeyRouter } from "./api-key"
import { channelRouter } from "./channel";
import { overviewRouter } from "./overview";
import { projectRouter } from "./project";

export const router = t.router({
  overview: overviewRouter,
  project: projectRouter,
  channel: channelRouter,
  apiKey: apiKeyRouter
});

export type Router = typeof router;
