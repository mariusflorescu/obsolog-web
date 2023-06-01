"use client";

import { useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { Button } from "~/components/ui/button";
import { Icons } from "~/components/ui/icons";

export default function Landing() {
  const user = useUser();
  const { push } = useRouter();

  return (
    <div>
      <div className="h-screen gradient-bg">
        <div className="w-full h-full container p-16">
          <div className="flex justify-end">
            {user ? (
              <Button
                variant="secondary"
                onClick={() => push("/dashboard/overview")}
              >
                Go to Dashboard
              </Button>
            ) : (
              <Button
                variant="secondary"
                onClick={() => push("/dashboard/overview")}
              >
                Log In
              </Button>
            )}
          </div>
          <div className="mt-32 text-center">
            <h1 className="font-heading text-5xl">Obsolog.</h1>
            <h1 className="text-muted-foreground font-heading text-5xl">
              Dead simple monitoring tool.
            </h1>
            <p className="my-4">
              Keep track of the most important events in your app, without the
              hassle.
            </p>
            <Button onClick={() => push("/dashboard/overview")}>
              <span>Get Started</span>
              <Icons.arrowRight className="ml-2 w-5 h-5" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
