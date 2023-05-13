"use client";

import { ThemeToggle } from "~/components/theme-toggle";
import { Icons } from "~/components/ui/icons";
import { ChannelItem, ChannelList } from "./channel";
import { MainItem, MainList } from "./main";

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

        <ChannelList />
      </div>
      <div className="flex justify-center">
        <ThemeToggle />
      </div>
    </aside>
  );
}