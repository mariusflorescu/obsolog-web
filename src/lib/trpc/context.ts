import { inferAsyncReturnType } from "@trpc/server";
import * as trpcNext from "@trpc/server/adapters/next";
import { getAuth } from "@clerk/nextjs/server";
import console from "console";

export async function createContext({
  req,
  res,
}: trpcNext.CreateNextContextOptions) {
  const { userId } = getAuth(req);

  return {
    req,
    res,
    user: userId ? { id: userId } : null,
    tenant: userId ? { id: userId } : null,
  };
}

export type Context = inferAsyncReturnType<typeof createContext>;
