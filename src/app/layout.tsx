import { cn } from "~/lib/utils";
import "./globals.css";
import { Inter } from "next/font/google";
import { ThemeProvider } from "~/providers/theme";
import { TailwindIndicator } from "~/components/tailwind-indicator";
import { ClerkProvider } from "@clerk/nextjs/app-beta"

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export const metadata = {
  title: "Create Next App",
  description: "Generated by create next app",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={inter.variable}>
      <body className="min-h-screen antialised">
        <ThemeProvider attribute="class" defaultTheme="dark" enableSystem>
          <ClerkProvider>{children}</ClerkProvider>
          <TailwindIndicator />
        </ThemeProvider>
      </body>
    </html>
  );
}
