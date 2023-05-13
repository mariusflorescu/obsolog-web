import { t } from "../trpc";
import { channelRouter } from "./channel";
import { overviewRouter } from "./overview";
import { projectRouter } from "./project";

export const router = t.router({
  overview: overviewRouter,
  project: projectRouter,
  channel: channelRouter,
});

export type Router = typeof router;
