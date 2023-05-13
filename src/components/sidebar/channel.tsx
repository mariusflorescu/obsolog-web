"use client";

import Link from "next/link";
import { Icons } from "../ui/icons";
import { Button } from "../ui/button";
import { trpc } from "~/lib/trpc/client";
import { Skeleton } from "../ui/skeleton";
import { AddChannelModal } from "../channel/add";

export function ChannelList() {
  const { data, isFetching } = trpc.channel.get.useQuery();

  return (
    <div>
      <div className="flex items-center justify-between text-muted-foreground text-sm">
        <span className="font-semibold">Channels</span>
        <AddChannelModal />
      </div>
      <ul className="mt-4 flex flex-col gap-4 list-none text-zinc-600 dark:text-zinc-400">
        {isFetching && (
          <>
            <Skeleton className="w-full h-[40px]" />
            <Skeleton className="w-full h-[40px]" />
            <Skeleton className="w-full h-[40px]" />
          </>
        )}
        {!isFetching &&
          data &&
          data.length > 0 &&
          data.map((channel) => (
            <ChannelItem key={channel.id} href={`/channels/${channel.id}`}>
              {channel.name}
            </ChannelItem>
          ))}
        {!isFetching && data && data.length === 0 && (
          <span className="text-muted-foreground text-xs">
            No channels created
          </span>
        )}
      </ul>
    </div>
  );
}

type ChannelItemProps = {
  children: React.ReactNode;
  href: string;
};
export function ChannelItem({ children, href }: ChannelItemProps) {
  return (
    <li className="w-full">
      <Link
        href={href}
        className="w-full flex items-center gap-4 hover:bg-muted rounded-md p-2"
      >
        <Icons.hash className="w-5 h-5" />
        <span>{children}</span>
      </Link>
    </li>
  );
}
