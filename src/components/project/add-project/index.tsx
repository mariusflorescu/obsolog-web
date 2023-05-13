import { AddProjectModal } from "~/components/project/add-project/modal";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";

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
        <AddProjectModal>Add</AddProjectModal>
      </CardContent>
    </Card>
  );
}
