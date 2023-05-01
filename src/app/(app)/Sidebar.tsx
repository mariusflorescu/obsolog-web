"use client";

import Link from "next/link";
import * as React from "react";
import { ThemeToggle } from "~/components/theme-toggle";
import { Icons } from "~/components/ui/icons";

/*
 * Main Nav
 * Overview, Projects, Organization
 */
function MainList({ children }: React.PropsWithChildren) {
  return (
    <ul className="flex flex-col gap-4 list-none  text-zinc-600 dark:text-zinc-400 font-medium">
      {children}
    </ul>
  );
}

type MainItemProps = {
  icon: React.ReactNode;
  children: React.ReactNode;
  href: string;
};
function MainItem({ icon, children, href }: MainItemProps) {
  return (
    <li className=" w-full">
      <Link
        href={href}
        className="w-full flex items-center gap-4 hover:bg-muted rounded p-2"
      >
        {icon}
        <span>{children}</span>
      </Link>
    </li>
  );
}

/*
 * Channels
 */
function ChannelList({ children }: React.PropsWithChildren) {
  return (
    <ul className="flex flex-col gap-4 list-none text-zinc-600 dark:text-zinc-400">
      {children}
    </ul>
  );
}

type ChannelItemProps = {
  children: React.ReactNode;
  href: string;
};
function ChannelItem({ children, href }: ChannelItemProps) {
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

export function Sidebar() {
  return (
    <aside className="hidden md:h-full md:flex md:flex-col md:justify-between md:w-[240px] lg:w-[320px] border-r p-8">
      <div className="flex flex-col gap-12">
        <MainList>
          <MainItem
            icon={<Icons.overview className="w-5 h-5" />}
            href="/overview"
          >
            Overview
          </MainItem>
          <MainItem
            icon={<Icons.projects className="w-5 h-5" />}
            href="/projects"
          >
            Projects
          </MainItem>
          <MainItem
            icon={<Icons.organization className="w-5 h-5" />}
            href="/organization"
          >
            Organization
          </MainItem>
        </MainList>

        {/* Fetch data and display it accordingly */}
        <ChannelList>
          <ChannelItem href="/overview">auth.user.created</ChannelItem>
          <ChannelItem href="/projects">auth.org.created</ChannelItem>
          <ChannelItem href="/organization">subscription.paid</ChannelItem>
        </ChannelList>
      </div>
      <div className="flex justify-center">
        <ThemeToggle />
      </div>
    </aside>
  );
}
