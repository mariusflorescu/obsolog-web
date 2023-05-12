import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
} from "~/components/ui/card";
import { ProjectsView } from "./projects";
import { AddProjectModal } from "~/components/add-project-modal";
import { Icons } from "~/components/ui/icons";

export default function Projects() {
  return (
    <div className="w-full h-full py-8 flex flex-col gap-8">
      <Card className="w-full">
        <CardHeader className="flex flex-row justify-between">
          <div>
            <CardTitle>Projects</CardTitle>
            <CardDescription className="mt-2">
              Here you will see all your projects
            </CardDescription>
          </div>
          <AddProjectModal buttonVariant="ghost" buttonSize="sm">
            <Icons.plus />
          </AddProjectModal>
        </CardHeader>
      </Card>
      <ProjectsView />
    </div>
  );
}
