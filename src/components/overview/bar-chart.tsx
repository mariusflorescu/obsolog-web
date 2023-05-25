import { BarChart as TremorBarChart } from "@tremor/react";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";

type Props = {
  data: { "Number of Events": number; "Channel Name": string }[];
};

export function BarChart({ data }: Props) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Number of events/channel</CardTitle>
      </CardHeader>
      <CardContent>
        <TremorBarChart
          className="h-72 mt-4"
          data={data}
          index="Channel Name"
          categories={["Number of Events"]}
          colors={["blue"]}
          yAxisWidth={48}
        />
      </CardContent>
    </Card>
  );
}
