"use client";

import { useRouter } from "next/navigation";
import { Button } from "../ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../ui/card";
import { Anchor } from "../ui/anchor";

type Props = {
  id: string;
  name: string;
  description: string | null;
  url: string;
};

export function ProjectCard({ id, name, description, url }: Props) {
  const { push } = useRouter();

  return (
    <Card>
      <CardHeader>
        <CardTitle>{name}</CardTitle>
        <CardDescription>
          <Anchor href={url} target="_blank">
            {url}
          </Anchor>
        </CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col gap-8 justify-between">
        <p className="text-sm text-muted-foreground">{description}</p>
        <div className="flex justify-end">
          <Button onClick={() => push(`/dashboard/projects/${id}`)}>View Project</Button>
        </div>
      </CardContent>
    </Card>
  );
}
