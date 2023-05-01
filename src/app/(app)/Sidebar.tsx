"use client";

import Link from "next/link";
import * as React from "react";
import { ThemeToggle } from "~/components/theme-toggle";
import { Icons } from "~/components/ui/icons";

function SidebarList({ children }: React.PropsWithChildren) {
  return <ul className="flex flex-col gap-4 list-none">{children}</ul>;
}

type SidebarItemProps = {
  icon: React.ReactNode;
  children: React.ReactNode;
  href: string;
};
function SidebarItem({ icon, children, href }: SidebarItemProps) {
  return (
    <li className="text-zinc-600 dark:text-zinc-400 font-medium w-full">
      <Link
        href={href}
        className="w-full flex items-center gap-4 hover:bg-zinc-200 hover:dark:bg-zinc-900 p-2"
      >
        {icon}
        <span>{children}</span>
      </Link>
    </li>
  );
}

export function Sidebar() {
  return (
    <aside className="hidden md:h-full md:flex md:flex-col md:justify-between md:w-[240px] lg:w-[320px] border-r border-zinc-100 dark:border-zinc-800 py-8 px-4">
      <SidebarList>
        <SidebarItem icon={<Icons.feed className="w-5 h-5" />} href="/">
          Hello
        </SidebarItem>
        <SidebarItem icon={<Icons.feed className="w-5 h-5" />} href="/">
          Hello
        </SidebarItem>
        <SidebarItem icon={<Icons.feed className="w-5 h-5" />} href="/">
          Hello
        </SidebarItem>
      </SidebarList>
      <div className="flex justify-center">
        <ThemeToggle />
      </div>
    </aside>
  );
}
