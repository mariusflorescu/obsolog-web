import { Button } from "~/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";
import { AddProject } from "./add-project";

export default function Projects() {
  return (
    <div className="py-8 flex flex-col gap-8">
      <Card className="w-full">
        <CardHeader>
          <CardTitle>Projects</CardTitle>
          <CardDescription>Here you will see all your projects</CardDescription>
        </CardHeader>
      </Card>
      <AddProject />
    </div>
  );
}
