"use client";

import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuItem,
  DropdownMenuGroup,
  DropdownMenuShortcut,
} from "~/components/ui/dropdown-menu";
import { Button } from "~/components/ui/button";
import { Skeleton } from "./ui/skeleton";
import { useUser } from "@clerk/nextjs";
import { Avatar, AvatarImage, AvatarFallback } from "./ui/avatar";
import { useTheme } from "next-themes";
import { Icons } from "./ui/icons";

export function UserSettings() {
  const { theme, setTheme } = useTheme();
  const { isLoaded, user } = useUser();

  const email = user?.emailAddresses?.[0].emailAddress;
  const fullName = `${user?.firstName} ${user?.lastName}`;
  const shouldShowFullname = user?.firstName && user?.lastName;
  const avatarFallback =
    user?.firstName && user.lastName
      ? `${user.firstName[0]}${user.lastName[0]}`
      : `${email?.[0]}${email?.[1]}`;

  if (!isLoaded) {
    return <Skeleton className="w-full h-[58px]" />;
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" className="h-auto">
          <div className="flex gap-4 items-center">
            <Avatar>
              <AvatarImage src={user?.profileImageUrl} />
              <AvatarFallback>{avatarFallback}</AvatarFallback>
            </Avatar>
            <div className="flex flex-col items-start">
              <span>{email}</span>
              <span className="text-xs text-muted-foreground font-regular">
                {shouldShowFullname ? fullName : ""}
              </span>
            </div>
          </div>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start" className="min-w-[200px]">
        <DropdownMenuLabel>
          <div className="flex flex-col gap-2">
            <span>{email}</span>
            <span className="text-xs text-muted-foreground font-regular">
              {fullName}
            </span>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuLabel>Appearance</DropdownMenuLabel>
          <DropdownMenuItem onClick={() => setTheme("system")}>
            <Icons.laptop className="w-4 h-4 mr-2" />
            <span>System</span>
            <DropdownMenuShortcut>
              {theme === "system" && <Icons.check className="w-4 h-4" />}
            </DropdownMenuShortcut>
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => setTheme("light")}>
            <Icons.sun className="w-4 h-4 mr-2" />
            <span>Light</span>
            <DropdownMenuShortcut>
              {theme === "light" && <Icons.check className="w-4 h-4" />}
            </DropdownMenuShortcut>
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => setTheme("dark")}>
            <Icons.moon className="w-4 h-4 mr-2" />
            <span>Dark</span>
            <DropdownMenuShortcut>
              {theme === "dark" && <Icons.check className="w-4 h-4" />}
            </DropdownMenuShortcut>
          </DropdownMenuItem>
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
