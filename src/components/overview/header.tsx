import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
} from "~/components/ui/card";

export function Header() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Overview</CardTitle>
        <CardDescription className="mt-2">
          Your "home", see general statistics of things that happen all across
          your tenant!
        </CardDescription>
      </CardHeader>
    </Card>
  );
}
