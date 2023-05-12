"use client";

import { trpc } from "~/lib/trpc/client";
import { AddProject } from "./add-project";
import { ProjectCard } from "~/components/project-card";
import { Spinner } from "~/components/ui/spinner";

export function ProjectsView() {
  const { data, isLoading } = trpc.project.get.useQuery();

  if (isLoading) {
    return <Spinner />;
  }

  if (data?.length === 0) {
    return <AddProject />;
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 grid-flow-col gap-4">
      {data?.map((project) => (
        <ProjectCard
          id={project.id}
          name={project.name}
          url={project.url}
          description={project.description}
        />
      ))}
    </div>
  );
}
