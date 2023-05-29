"use client";

import { ColumnDef } from "@tanstack/react-table";
import { format } from "date-fns";
import { TableData } from "./index";

export const columns: ColumnDef<TableData>[] = [
  {
    accessorKey: "name",
    header: "Name",
  },
  {
    accessorKey: "description",
    header: "Description",
  },
  {
    accessorKey: "user",
    header: "User",
  },
  {
    accessorKey: "createdAt",
    header: "Created",
    cell: ({ row }) => format(row.getValue("createdAt"), "dd/MM/yyyy HH:mm"),
  },
];
