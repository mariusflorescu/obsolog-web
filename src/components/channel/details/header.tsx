"use client";

import { useParams } from "next/navigation";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";
import { Spinner } from "~/components/ui/spinner";
import { trpc } from "~/lib/trpc/client";
import { format } from "date-fns";

export function Header() {
  const params = useParams();
  const id = params?.id;
  const { data, isFetching } = trpc.channel.getChannel.useQuery(
    { id: id as string },
    {
      enabled: typeof id !== "undefined",
    }
  );

  if (isFetching) {
    return <Spinner />;
  }

  return (
    <Card>
      <CardHeader className="flex flex-row justify-between gap-2">
        <div>
          <CardTitle>{data?.name}</CardTitle>
          <CardDescription>
            <i className="italic">
              Created on {format(data!.createdAt, "dd/MM/yyyy")}
            </i>
          </CardDescription>
        </div>
      </CardHeader>
    </Card>
  );
}
