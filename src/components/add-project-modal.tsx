"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { PropsWithChildren, useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { z } from "zod";
import { Button, ButtonProps } from "~/components/ui/button";
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
import { Textarea } from "./ui/textarea";

const projectSchema = z.object({
  name: z.string().nonempty("This field must not be empty"),
  url: z
    .string()
    .nonempty("This field must not be empty")
    .url("Must be a valid URL"),
  description: z.string().nullable(),
});

type ProjectSchema = z.infer<typeof projectSchema>;

type Props = PropsWithChildren<{
  buttonVariant?: ButtonProps["variant"];
  buttonSize?: ButtonProps["size"];
}>;

export function AddProjectModal({
  children,
  buttonVariant,
  buttonSize,
}: Props) {
  const { toast } = useToast();
  const utils = trpc.useContext();
  const { mutate, isLoading } = trpc.project.create.useMutation({
    onSuccess(_, variables) {
      setOpen(false);
      toast({
        title: "Project created",
        description: `We have succcessfully created project ${variables.name}!`,
      });
      utils.project.invalidate();
    },
  });

  const [open, setOpen] = useState(false);
  const { register, handleSubmit } = useForm<ProjectSchema>({
    defaultValues: {
      name: "",
      url: "",
      description: null,
    },
    resolver: zodResolver(projectSchema),
  });

  const onSubmit: SubmitHandler<ProjectSchema> = ({ name, url, description }) =>
    mutate({ name, url, description });

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant={buttonVariant} size={buttonSize}>
          {children}
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create Project</DialogTitle>
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
