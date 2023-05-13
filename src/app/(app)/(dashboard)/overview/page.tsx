import { Content } from "~/components/overview/content";
import { Header } from "../../../../components/overview/header";

export default function Overview() {
  return (
    <div className="w-full h-full py-8 flex flex-col gap-8">
      <Header />
      <Content />
    </div>
  );
}
