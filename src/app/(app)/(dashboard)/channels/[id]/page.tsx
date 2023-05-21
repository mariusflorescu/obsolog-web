import { Content } from "~/components/channel/details/content";
import { Header } from "~/components/channel/details/header";

export default function ChannelDetails() {
  return (
    <div className="w-full h-full py-8 flex flex-col gap-8">
      <Header />
      <Content />
    </div>
  );
}
