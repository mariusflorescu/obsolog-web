"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "~/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "~/components/ui/dialog";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import { useToast } from "~/hooks/use-toast";
import { trpc } from "~/lib/trpc/client";
import { Textarea } from "../../ui/textarea";
import { Icons } from "~/components/ui/icons";

const projectSchema = z.object({
  name: z.string().nonempty("This field must not be empty"),
  url: z
    .string()
    .nonempty("This field must not be empty")
    .url("Must be a valid URL"),
  description: z.string().nullable(),
});

type ProjectSchema = z.infer<typeof projectSchema>;

export function EditProjectModal({ id }: { id: string }) {
  const { toast } = useToast();
  const utils = trpc.useContext();
  const { data } = trpc.project.getProject.useQuery({ id });
  const { mutate, isLoading } = trpc.project.update.useMutation({
    onSuccess(_, variables) {
      setOpen(false);
      toast({
        title: "Project updated",
        description: `We have succcessfully updated your project ${variables.name}!`,
      });
      utils.project.get.invalidate();
      utils.project.overview.invalidate();
      utils.project.getProject.invalidate({ id });
    },
  });

  const [open, setOpen] = useState(false);
  const { register, handleSubmit, reset } = useForm<ProjectSchema>({
    defaultValues: {
      name: data?.name ?? "",
      url: data?.url ?? "",
      description: data?.description ?? null,
    },
    resolver: zodResolver(projectSchema),
  });

  const onSubmit: SubmitHandler<ProjectSchema> = ({ name, url, description }) =>
    mutate({ id, name, url, description });

  useEffect(() => {
    if (data) {
      reset(data);
    }
  }, [data]);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="ghost" size="sm">
          <Icons.edit />
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit Project</DialogTitle>
        </DialogHeader>
        <form
          className="mt-8 flex flex-col gap-4"
          onSubmit={handleSubmit(onSubmit)}
        >
          <div className="grid w-full items-center gap-1.5">
            <Label htmlFor="project-name">Project name*</Label>
            <Input
              id="project-name"
              placeholder="Unicorn Project"
              {...register("name")}
            />
          </div>
          <div className="grid w-full items-center gap-1.5">
            <Label htmlFor="url">Project URL*</Label>
            <Input
              id="url"
              placeholder="https://unicorn.app"
              {...register("url")}
            />
          </div>
          <div className="grid w-full items-center gap-1.5">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              placeholder="My awesome project"
              {...register("description")}
            />
          </div>
          <div className="mt-4 flex justify-center gap-4">
            <Button className="w-full" type="submit" disabled={isLoading}>
              {isLoading ? "Loading..." : "Submit"}
            </Button>
            <Button
              variant="outline"
              className="w-full"
              onClick={() => setOpen(false)}
            >
              Cancel
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
