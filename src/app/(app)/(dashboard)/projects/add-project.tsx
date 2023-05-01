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
          <DialogTrigger>Open</DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Are you sure absolutely sure?</DialogTitle>
              <DialogDescription>
                This action cannot be undone. This will permanently delete your
                account and remove your data from our servers.
              </DialogDescription>
            </DialogHeader>
          </DialogContent>
        </Dialog>
      </CardContent>
    </Card>
  );
}
