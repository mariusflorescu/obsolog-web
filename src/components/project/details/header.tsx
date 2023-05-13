"use client";

import { Anchor } from "~/components/ui/anchor";
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
import { Delete } from "./delete";

export function Header() {
  const params = useParams();
  const id = params?.id;
  const { data, isFetching } = trpc.project.getProject.useQuery(
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
            <Anchor href={data?.url} target="_blank">
              {data?.url}
            </Anchor>
          </CardDescription>
        </div>
        <div className="flex gap-2 items-center">
          <Delete id={id as string} />
        </div>
      </CardHeader>
      <CardContent className="flex flex-col gap-8 justify-between">
        <p className="text-sm text-muted-foreground">{data?.description}</p>
      </CardContent>
    </Card>
  );
}
