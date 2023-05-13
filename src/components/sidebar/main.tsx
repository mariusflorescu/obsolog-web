"use client";

import Link from "next/link";

export function MainList({ children }: React.PropsWithChildren) {
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
export function MainItem({ icon, children, href }: MainItemProps) {
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
