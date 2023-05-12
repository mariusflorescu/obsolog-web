"use client";

import React from "react";
import { cn } from "~/lib/utils";

export function Anchor({
  className,
  ...props
}: React.DetailedHTMLProps<
  React.AnchorHTMLAttributes<HTMLAnchorElement>,
  HTMLAnchorElement
>) {
  return (
    <a
      {...props}
      className={cn(
        "underline-offset-4 hover:underline text-muted-foreground",
        className
      )}
    />
  );
}
