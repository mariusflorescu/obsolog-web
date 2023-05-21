import { AreaChart } from "@tremor/react";
import { Card, CardContent } from "~/components/ui/card";

type Props = {
  data: { "Number of Events": number; createdAt: string }[];
};

export function Chart({ data }: Props) {
  return (
    <Card>
      <CardContent>
        <AreaChart
          className="h-72 mt-4"
          data={data}
          index="createdAt"
          categories={["Number of Events"]}
          colors={["cyan"]}
        />
      </CardContent>
    </Card>
  );
}
