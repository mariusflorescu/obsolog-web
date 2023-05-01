import { PropsWithChildren } from "react";
import { ReactQueryProvider } from "~/providers/react-query";

export default function DashboardLayout({ children }: PropsWithChildren) {
  return <ReactQueryProvider>{children}</ReactQueryProvider>;
}
