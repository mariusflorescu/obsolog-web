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

export function DeleteChannelModal({ id }: { id: string }) {
  const [open, setOpen] = useState(false);
  const { push } = useRouter();
  const utils = trpc.useContext();
  const { toast } = useToast();
  const { mutate, isLoading } = trpc.channel.deleteChannel.useMutation({
    onSuccess() {
      toast({
        title: "Deleted Channel",
        description: "We have successfully deleted your channel!",
      });
      push("/overview");
      utils.channel.get.invalidate();
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
            channel and all associated events.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction
            onClick={() => mutate({ id })}
            disabled={isLoading}
          >
            {!isLoading ? "Continue" : "Loading..."}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
