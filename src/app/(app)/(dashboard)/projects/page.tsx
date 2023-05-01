import { Button } from "~/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";

export default function Projects() {
  return (
    <div className="py-8 flex flex-col gap-8">
      <Card className="w-full">
        <CardHeader>
          <CardTitle>Projects</CardTitle>
          <CardDescription>Here you will see all your projects</CardDescription>
        </CardHeader>
      </Card>
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
          <Button>Add</Button>
        </CardContent>
      </Card>
    </div>
  );
}
