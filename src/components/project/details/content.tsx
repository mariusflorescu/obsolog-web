"use client";

import { useParams } from "next/navigation";
import { trpc } from "~/lib/trpc/client";
import { Chart } from "./chart";
import { Table } from "./table";

export function Content() {
  const params = useParams();
  const id = params?.id;
  const { data } = trpc.project.getProject.useQuery(
    { id: id as string },
    { enabled: false }
  );

  return (
    <>
      <Chart series={data?.series || []} keyNames={data?.keyNames || []} />
      <Table data={data?.events} />
    </>
  );
}
