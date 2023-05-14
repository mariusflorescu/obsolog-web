import { Card, CardHeader, CardTitle, CardDescription } from "../ui/card";
import { AddApiKeyModal } from "./add";

export function Header() {
  return (
    <Card>
      <CardHeader className="flex flex-row justify-between">
        <div>
          <CardTitle>API Keys</CardTitle>
          <CardDescription className="mt-2">
            Your secret management page.
            <br />
            Create and manage API keys for different projects and environments.
          </CardDescription>
        </div>
        <AddApiKeyModal />
      </CardHeader>
    </Card>
  );
}
