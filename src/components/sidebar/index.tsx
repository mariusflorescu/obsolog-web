"use client";

import { Icons } from "~/components/ui/icons";
import { UserSettings } from "../user-settings";
import { ChannelList } from "./channel";
import { MainItem, MainList } from "./main";

export function Sidebar() {
  return (
    <aside className="hidden md:h-full md:flex md:flex-col md:justify-between md:w-[240px] lg:w-[320px] border-r p-8">
      <div className="flex flex-col gap-12">
        <MainList>
          <MainItem
            icon={<Icons.overview className="w-5 h-5" />}
            href="/dashboard/overview"
          >
            Overview
          </MainItem>
          <MainItem
            icon={<Icons.projects className="w-5 h-5" />}
            href="/dashboard/projects"
          >
            Projects
          </MainItem>
          <MainItem
            icon={<Icons.key className="w-5 h-5" />}
            href="/dashboard/api-keys"
          >
            API Keys
          </MainItem>
        </MainList>

        <ChannelList />
      </div>
      <UserSettings />
    </aside>
  );
}
