"use client";

import { AddProjectModal } from "~/components/project/add-project/modal";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
} from "~/components/ui/card";
import { Icons } from "~/components/ui/icons";
import { trpc } from "~/lib/trpc/client";

export function Header() {
  const { data, isFetching } = trpc.project.get.useQuery(undefined, {
    enabled: false,
  });

  return (
    <Card className="w-full">
      <CardHeader className="flex flex-row justify-between">
        <div>
          <CardTitle>Projects</CardTitle>
          <CardDescription className="mt-2">
            Here you will see all your projects
          </CardDescription>
        </div>
        {!isFetching && data && data.length > 0 && (
          <AddProjectModal buttonVariant="ghost" buttonSize="sm">
            <Icons.plus />
          </AddProjectModal>
        )}
      </CardHeader>
    </Card>
  );
}
