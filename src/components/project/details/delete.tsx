"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "~/components/ui/alert-dialog";
import { Button } from "~/components/ui/button";
import { Icons } from "~/components/ui/icons";
import { useToast } from "~/hooks/use-toast";
import { trpc } from "~/lib/trpc/client";

export function DeleteProjectModal({ id }: { id: string }) {
  const [open, setOpen] = useState(false);
  const { push } = useRouter();
  const utils = trpc.useContext();
  const { toast } = useToast();
  const { mutate, isLoading } = trpc.project.deleteProject.useMutation({
    onSuccess() {
      toast({
        title: "Deleted Project",
        description: "We have successfully deleted your project!",
      });
      push("/projects");
      utils.project.get.invalidate();
      utils.overview.get.invalidate();
    },
  });
  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogTrigger asChild>
        <Button variant="ghost" size="sm">
          <Icons.trash />
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
          <AlertDialogDescription>
            This action cannot be undone. This will permanently delete your
            project and all associated events.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction
            onClick={() => mutate({ projectId: id })}
            disabled={isLoading}
          >
            {!isLoading ? "Continue" : "Loading..."}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
