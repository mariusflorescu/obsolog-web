import { SignIn, SignedIn, SignedOut } from "@clerk/nextjs/app-beta";
import { Sidebar } from "./Sidebar";

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <SignedIn>
        <div className="h-screen flex">
          <Sidebar />
          <main className="pl-12">{children}</main>
        </div>
      </SignedIn>
      <SignedOut>
        <div className="flex items-center justify-center h-screen">
          <SignIn
            appearance={{
              variables: {
                colorPrimary: "#161616",
                colorText: "#161616",
              },
            }}
            afterSignInUrl="/overview"
            afterSignUpUrl="/overview"
          />
        </div>
      </SignedOut>
    </>
  );
}
