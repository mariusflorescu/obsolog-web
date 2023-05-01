"use client";

import { Button } from "~/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "~/components/ui/dialog";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";

export function AddProject() {
  return (
    <Card className="w-full border-dashed border-4">
      <CardHeader>
        <CardTitle className="text-2xl text-center">
          No projects found
        </CardTitle>
        <CardDescription className="text-center">
          But there is no problem, click the "Add" button to add your first
          project!
        </CardDescription>
      </CardHeader>
      <CardContent className="flex justify-center">
        <Dialog>
          <DialogTrigger asChild>
            <Button>Add</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create Project</DialogTitle>
            </DialogHeader>
            <div className="mt-8 flex flex-col gap-4">
              <div className="grid w-full items-center gap-1.5">
                <Label htmlFor="project-name">Project name</Label>
                <Input id="project-name" placeholder="Unicorn Project" />
              </div>
              <div className="grid w-full items-center gap-1.5">
                <Label htmlFor="url">Project URL</Label>
                <Input id="url" placeholder="https://unicorn.app" />
              </div>
            </div>
            <div className="mt-4 flex justify-center gap-4">
              <Button className="w-full">Submit</Button>
              <Button variant="outline" className="w-full">
                Cancel
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </CardContent>
    </Card>
  );
}
