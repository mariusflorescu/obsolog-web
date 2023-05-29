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
import { DeleteProjectModal } from "./delete";
import { EditProjectModal } from "./edit";
import { format } from "date-fns";

export function Header() {
  const params = useParams();
  const id = params?.id;
  const { data: project, isFetching } = trpc.project.getProject.useQuery({
    id: id as string,
  });

  if (isFetching) {
    return <Spinner />;
  }

  return (
    <Card>
      <CardHeader className="flex flex-row justify-between gap-2">
        <div>
          <CardTitle>{project?.name}</CardTitle>
          <CardDescription>
            <Anchor href={project?.url} target="_blank">
              {project?.url}
            </Anchor>
            <div className="italic">
              Created on{" "}
              {project ? format(project!.createdAt, "dd/MM/yyyy") : ""}
            </div>
          </CardDescription>
        </div>
        <div className="flex gap-2 items-center">
          <EditProjectModal id={id as string} />
          <DeleteProjectModal id={id as string} />
        </div>
      </CardHeader>
      <CardContent className="flex flex-col gap-8 justify-between">
        <p className="text-sm text-muted-foreground">{project?.description}</p>
      </CardContent>
    </Card>
  );
}
