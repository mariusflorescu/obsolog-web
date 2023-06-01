import { Header } from "~/components/api-keys/header";
import { ApiKeysTable } from "~/components/api-keys/table";

export default function ApiKeys() {
  return (
    <div className="w-full h-full py-8 flex flex-col gap-8">
      <Header />
      <ApiKeysTable />
    </div>
  );
}
