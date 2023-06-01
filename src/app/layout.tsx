import "./globals.css";
import { Inter } from "next/font/google";
import { ThemeProvider } from "~/providers/theme";
import { TailwindIndicator } from "~/components/tailwind-indicator";
import { ClerkProvider } from "@clerk/nextjs/app-beta";
import LocalFont from "next/font/local";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

const calSans = LocalFont({
  src: "../../public/fonts/CalSans-SemiBold.ttf",
  variable: "--font-calsans",
});

export const metadata = {
  title: "Obsolog",
  description: "Dead simple monitoring tool",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={[inter.variable, calSans.variable].join(" ")}>
      <body className="min-h-screen antialised">
        <ThemeProvider attribute="class" defaultTheme="dark" enableSystem>
          <ClerkProvider>{children}</ClerkProvider>
          <TailwindIndicator />
        </ThemeProvider>
      </body>
    </html>
  );
}
