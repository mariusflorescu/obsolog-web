"use client";

import { Event } from "@prisma/client";
import { columns } from "./columns";
import { DataTable } from "./data-table";

export type TableData = Event & {
  channel: {
    name: string;
  };
};

type Props = {
  data: TableData[] | undefined;
};

export function Table({ data }: Props) {
  if (!data) {
    return null;
  }

  return <DataTable columns={columns} data={data} />;
}
