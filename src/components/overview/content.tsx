"use client";

import { trpc } from "~/lib/trpc/client";
import { Spinner } from "../ui/spinner";
import { Card, CardHeader, CardTitle, CardContent } from "../ui/card";

export function Content() {
  const { data, isFetching } = trpc.project.overview.useQuery();

  if (isFetching) {
    return <Spinner />;
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 grid-flow-col gap-4">
      <Card>
        <CardHeader>
          <CardTitle>Number of Projects</CardTitle>
        </CardHeader>
        <CardContent className="flex justify-center text-4xl font-bold">
          {data?.numOfProjects}
        </CardContent>
      </Card>
    </div>
  );
}
