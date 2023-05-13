import { t } from "../trpc";
import { channelRouter } from "./channel";
import { projectRouter } from "./project";

export const router = t.router({
  project: projectRouter,
  channel: channelRouter,
});

export type Router = typeof router;
