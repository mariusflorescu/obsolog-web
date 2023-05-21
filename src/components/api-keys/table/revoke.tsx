"use client";

import { Dispatch, SetStateAction } from "react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "~/components/ui/alert-dialog";
import { useToast } from "~/hooks/use-toast";
import { trpc } from "~/lib/trpc/client";

type Props = {
  id: string;
  open: boolean;
  setOpen: Dispatch<SetStateAction<boolean>>;
};

export function RevokeApiKeyModal({ id, open, setOpen }: Props) {
  const utils = trpc.useContext();
  const { toast } = useToast();
  const { mutate } = trpc.apiKey.revoke.useMutation({
    onSuccess() {
      toast({
        title: "Revoked API Key",
        description: "We have successfully revoked your API Key!",
      });
      utils.apiKey.get.invalidate();
      utils.overview.get.invalidate();
    },
  });
  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
          <AlertDialogDescription>
            This action cannot be undone. This will permanently delete your API
            Key and sending events with it will not be possible anymore.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction onClick={() => mutate({ id })}>
            I&apos;m sure
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
