"use client";

import { useMemo } from "react";
import { Spinner } from "~/components/ui/spinner";
import { trpc } from "~/lib/trpc/client";
import { DataTable } from "./data-table";
import { columns } from "./columns";

export function ApiKeysTable() {
  const { data, isFetching } = trpc.apiKey.get.useQuery();

  const tableData = useMemo(
    () =>
      data
        ? data.map((entry) => ({
            ...entry,
            projectName: entry.project.name,
          }))
        : [],
    [data]
  );

  if (isFetching) {
    return <Spinner />;
  }

  return <DataTable columns={columns} data={tableData} />;
}
