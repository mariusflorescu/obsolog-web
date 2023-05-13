"use client";

import { format } from "date-fns";
import { useParams } from "next/navigation";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";
import { Spinner } from "~/components/ui/spinner";
import { trpc } from "~/lib/trpc/client";
import { DeleteChannelModal } from "./delete";
import { EditChannelModal } from "./edit";

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
        <div className="flex gap-2 items-center">
          <EditChannelModal id={id as string} />
          <DeleteChannelModal id={id as string} />
        </div>
      </CardHeader>
    </Card>
  );
}
