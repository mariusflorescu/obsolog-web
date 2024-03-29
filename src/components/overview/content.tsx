"use client";

import { AlertOctagon } from "lucide-react";
import { trpc } from "~/lib/trpc/client";
import { Alert, AlertDescription, AlertTitle } from "../ui/alert";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Spinner } from "../ui/spinner";
import { BarChart } from "./bar-chart";

export function Content() {
  const { data, isFetching } = trpc.overview.get.useQuery();

  if (isFetching) {
    return <Spinner />;
  }

  if (data?.numOfProjects === 0 && data?.numOfChannels === 0) {
    return (
      <Alert>
        <AlertOctagon className="h-5 w-5" />
        <AlertTitle>Heads up!</AlertTitle>
        <AlertDescription>
          It looks like you haven&apos;t created any projects or channels yet.
          <br />
          In order to view overview insights, you need to have those and then
          start sending events with <b>Obsolog</b>!
        </AlertDescription>
      </Alert>
    );
  }

  return (
    <div className="flex flex-col gap-4">
      {data?.numOfApiKeys === 0 && (
        <Alert>
          <AlertOctagon className="h-5 w-5" />
          <AlertTitle>Heads up!</AlertTitle>
          <AlertDescription>
            It looks like you don&apos;t have any API Keys.
            <br />
            In order to keep receiving new insights you need to have one.
          </AlertDescription>
        </Alert>
      )}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 grid-flow-col gap-4">
        <Card>
          <CardHeader>
            <CardTitle>Number of Projects</CardTitle>
          </CardHeader>
          <CardContent className="flex justify-center text-4xl font-bold">
            {data?.numOfProjects}
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Number of Channels</CardTitle>
          </CardHeader>
          <CardContent className="flex justify-center text-4xl font-bold">
            {data?.numOfChannels}
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Number of API Keys</CardTitle>
          </CardHeader>
          <CardContent className="flex justify-center text-4xl font-bold">
            {data?.numOfApiKeys}
          </CardContent>
        </Card>
      </div>
      <BarChart data={data?.barSeries || []} />
    </div>
  );
}
