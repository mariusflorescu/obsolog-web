"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useMemo, useState } from "react";
import { Controller, SubmitHandler, useForm } from "react-hook-form";
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
import { trpc } from "~/lib/trpc/client";
import { Icons } from "../ui/icons";
import { Textarea } from "../ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/components/ui/select";
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
import { CopyButton } from "../copy-button";

const ENVIRONMENTS_SELECT = [
  {
    value: "DEVELOPMENT",
    label: "Development",
  },
  {
    value: "STAGIN",
    label: "Staging",
  },
  {
    value: "PRODUCTION",
    label: "Production",
  },
];

const apiKeySchema = z.object({
  name: z.string().nonempty("This field must not be empty"),
  description: z.string().nullable(),
  projectId: z.string().nonempty("This field must not be empty"),
  environment: z.enum(["DEVELOPMENT", "STAGING", "PRODUCTION"]),
});

type ApiKeySchema = z.infer<typeof apiKeySchema>;

export function AddApiKeyModal() {
  const { toast } = useToast();
  const utils = trpc.useContext();
  const { data: projects } = trpc.project.get.useQuery();
  const { mutate, isLoading } = trpc.apiKey.create.useMutation({
    onSuccess({ apiKey }) {
      setSavedAPIKey(apiKey);
      setOpenInitialDialog(false);
      setOpenSecondDialog(true);
      utils.apiKey.get.invalidate();
    },
    onError(err) {
      console.log(err);
    },
  });
  const { mutate: revokeAPIKey } = trpc.apiKey.initialRevoke.useMutation({
    onSuccess() {
      toast({
        title: "Revoked API Key",
        description: "We have successfully revoked your API Key",
      });
    },
  });

  const [savedAPIKey, setSavedAPIKey] = useState<string | undefined>();
  const [openInitialDialog, setOpenInitialDialog] = useState(false);
  const [openSecondDialog, setOpenSecondDialog] = useState(false);
  const { register, handleSubmit, control } = useForm<ApiKeySchema>({
    defaultValues: {
      name: "",
      description: null,
    },
    resolver: zodResolver(apiKeySchema),
  });

  const projectsSelect = useMemo(
    () =>
      projects
        ? projects.map((project) => ({
            label: project.name,
            value: project.id,
          }))
        : [],
    [projects]
  );

  const onSubmit: SubmitHandler<ApiKeySchema> = ({
    name,
    description,
    projectId,
    environment,
  }) => mutate({ name, description, projectId, environment });

  return (
    <>
      <Dialog open={openInitialDialog} onOpenChange={setOpenInitialDialog}>
        <DialogTrigger asChild>
          <Button className="h-6" size="sm" variant="ghost">
            <Icons.plus className="w-4 h-4" />
          </Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create API Key</DialogTitle>
          </DialogHeader>
          <form
            className="mt-8 flex flex-col gap-4"
            onSubmit={handleSubmit(onSubmit)}
          >
            <div className="grid w-full items-center gap-1.5">
              <Label htmlFor="key-name">Name*</Label>
              <Input
                id="key-name"
                placeholder="UnicornApp Development"
                {...register("name")}
              />
            </div>
            <div className="grid w-full items-center gap-1.5">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                placeholder="Some description of how is this API Key going to be used"
                {...register("description")}
              />
            </div>
            <div className="grid w-full items-center gap-1.5">
              <Controller
                control={control}
                name="projectId"
                render={({ field }) => (
                  <Select onValueChange={field.onChange} {...field}>
                    <SelectTrigger>
                      <SelectValue placeholder="Project" />
                    </SelectTrigger>
                    <SelectContent>
                      {projectsSelect.map((project) => (
                        <SelectItem key={project.value} value={project.value}>
                          {project.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              />
            </div>
            <div className="grid w-full items-center gap-1.5">
              <Controller
                control={control}
                name="environment"
                render={({ field }) => (
                  <Select onValueChange={field.onChange} {...field}>
                    <SelectTrigger>
                      <SelectValue placeholder="Environment" />
                    </SelectTrigger>
                    <SelectContent>
                      {ENVIRONMENTS_SELECT.map((env) => (
                        <SelectItem key={env.value} value={env.value}>
                          {env.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              />
            </div>
            <div className="mt-4 flex justify-center gap-4">
              <Button className="w-full" type="submit" disabled={isLoading}>
                {isLoading ? "Loading..." : "Submit"}
              </Button>
              <Button
                variant="outline"
                className="w-full"
                onClick={() => setOpenInitialDialog(false)}
              >
                Cancel
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
      <AlertDialog open={openSecondDialog} onOpenChange={setOpenSecondDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Your new API Key</AlertDialogTitle>
            <AlertDialogDescription>
              <div className="my-4 flex gap-4 justify-between">
                <div className="bg-card py-1 px-2 overflow-ellipsis w-full flex items-center rounded">
                  {savedAPIKey}
                </div>
                {savedAPIKey && (
                  <CopyButton value={savedAPIKey} variant="outline" size="sm" />
                )}
              </div>
              Here is your new API KEY.
              <br />
              This is the <b>only time</b> that you will see it. Please make
              sure that you have stored it somewhere safely.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel
              onClick={() => savedAPIKey && revokeAPIKey({ id: savedAPIKey })}
            >
              Cancel and revoke
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={() =>
                toast({
                  title: "Created API Key",
                  description: "We have successfully created your new API Key",
                })
              }
            >
              I copied it
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
