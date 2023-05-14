"use client";

import { ColumnDef } from "@tanstack/react-table";
import { format } from "date-fns";
import { MoreHorizontal } from "lucide-react";
import { z } from "zod";
import { Badge } from "~/components/ui/badge";

import { useState } from "react";
import { Button } from "~/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "~/components/ui/dropdown-menu";
import { RevokeApiKeyModal } from "./revoke";

const apiKeySchema = z.object({
  id: z.string(),
  name: z.string(),
  description: z.string().nullable(),
  projectName: z.string(),
  environment: z.enum(["DEVELOPMENT", "STAGING", "PRODUCTION"]),
  createdAt: z.date(),
  updatedAt: z.date(),
});

type ApiKeySchema = z.infer<typeof apiKeySchema>;

const EnvironmentBadge = {
  DEVELOPMENT: (
    <Badge className="bg-yellow-600 hover:bg-yellow-600 dark:bg-yellow-400 dark:hover:bg-yellow-400 text-primary-foreground">
      Development
    </Badge>
  ),
  STAGING: (
    <Badge className="bg-blue-600 hover:bg-blue-600 dark:bg-blue-400 dark:hover:bg-blue-400 text-primary-foreground">
      Staging
    </Badge>
  ),
  PRODUCTION: (
    <Badge className="bg-red-600 hover:bg-red-600 dark:bg-red-400 dark:hover:bg-red-400 text-primary-foreground">
      Production
    </Badge>
  ),
};

export const columns: ColumnDef<ApiKeySchema>[] = [
  {
    accessorKey: "id",
    header: "ID",
    cell: () => "****************",
  },
  {
    accessorKey: "name",
    header: "Name",
  },
  {
    accessorKey: "description",
    header: "Description",
  },
  {
    accessorKey: "projectName",
    header: "Project Name",
  },
  {
    accessorKey: "environment",
    header: "Environment",
    cell: ({ row }) =>
      EnvironmentBadge[
        row.getValue("environment") as ApiKeySchema["environment"]
      ],
  },
  {
    accessorKey: "createdAt",
    header: "Created",
    cell: ({ row }) => format(row.getValue("createdAt"), "dd/MM/yyyy"),
  },
  {
    accessorKey: "updatedAt",
    header: "Last Modified",
    cell: ({ row }) => format(row.getValue("updatedAt"), "dd/MM/yyyy"),
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const [open, setOpen] = useState(false);
      const apiKey = row.original;

      return (
        <>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0">
                <span className="sr-only">Open API Keys action menu</span>
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Actions</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                className="text-destructive"
                onClick={() => setOpen(true)}
              >
                Revoke
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          <RevokeApiKeyModal id={apiKey.id} open={open} setOpen={setOpen} />
        </>
      );
    },
  },
];
