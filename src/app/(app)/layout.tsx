import { SignIn, SignedIn, SignedOut } from "@clerk/nextjs/app-beta";

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <SignedIn>{children}</SignedIn>
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
