import { t } from "../trpc";
import { projectRouter } from "./project";

export const router = t.router({
  project: projectRouter,
});

export type Router = typeof router;
