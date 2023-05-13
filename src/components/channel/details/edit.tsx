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
import { Icons } from "~/components/ui/icons";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import { useToast } from "~/hooks/use-toast";
import { trpc } from "~/lib/trpc/client";

const channelSchema = z.object({
  name: z
    .string()
    .nonempty("This field must not be empty")
    .regex(
      /^[a-z\.]+$/,
      "This field must use the foolowing patter `auth.user.created`"
    ),
});

type ChannelSchema = z.infer<typeof channelSchema>;

export function EditChannelModal({ id }: { id: string }) {
  const { toast } = useToast();
  const utils = trpc.useContext();
  const { data } = trpc.channel.getChannel.useQuery({ id });
  const { mutate, isLoading } = trpc.channel.update.useMutation({
    onSuccess(_, variables) {
      setOpen(false);
      toast({
        title: "Channel updated",
        description: `We have succcessfully updated your channel ${variables.name}!`,
      });
      utils.channel.get.invalidate();
      utils.channel.getChannel.invalidate({ id });
    },
  });

  const [open, setOpen] = useState(false);
  const { register, handleSubmit, reset } = useForm<ChannelSchema>({
    defaultValues: {
      name: data?.name ?? "",
    },
    resolver: zodResolver(channelSchema),
  });

  const onSubmit: SubmitHandler<ChannelSchema> = ({ name }) =>
    mutate({ id, name });

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
          <DialogTitle>Edit Channel</DialogTitle>
        </DialogHeader>
        <form
          className="mt-8 flex flex-col gap-4"
          onSubmit={handleSubmit(onSubmit)}
        >
          <div className="grid w-full items-center gap-1.5">
            <Label htmlFor="channel-name">Channel name*</Label>
            <Input
              id="channel-name"
              placeholder="auth.user.created"
              {...register("name")}
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
