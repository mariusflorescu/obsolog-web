import { SignIn, SignedIn, SignedOut } from "@clerk/nextjs/app-beta";
import { Toaster } from "~/components/ui/toaster";
import { ReactQueryProvider } from "~/providers/react-query";
import { Sidebar } from "../../components/sidebar";

export default async function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <SignedIn>
        <ReactQueryProvider>
          <div className="h-screen flex">
            <Sidebar />
            <main className="w-full px-4 md:px-8 lg:px-12 overflow-x-hidden">
              {children}
            </main>
          </div>
        </ReactQueryProvider>
        <Toaster />
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
            afterSignInUrl="/dashboard/overview"
            afterSignUpUrl="/dashboard/overview"
          />
        </div>
      </SignedOut>
    </>
  );
}
