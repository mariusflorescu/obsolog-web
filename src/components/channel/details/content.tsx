"use client";

import { useParams } from "next/navigation";
import { trpc } from "~/lib/trpc/client";
import { Chart } from "./chart";
import { Table } from "./table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/components/ui/select";
import { z } from "zod";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

const SELECT_ITEMS = [
  {
    label: "Last 7 days",
    value: "7",
  },
  {
    label: "Last 30 days",
    value: "30",
  },
  {
    label: "Last 60 days",
    value: "60",
  },
  {
    label: "Last 90 days",
    value: "90",
  },
];

const contentSchema = z.object({
  from: z.enum(["7", "30", "60", "90"]),
});

type ContentSchema = z.infer<typeof contentSchema>;

export function Content() {
  const params = useParams();
  const { watch, control } = useForm<ContentSchema>({
    defaultValues: {
      from: "7",
    },
    resolver: zodResolver(contentSchema),
  });
  const selectedValue = Number(watch("from"));
  const { data, isFetching } = trpc.channel.channelActivity.useQuery(
    {
      id: params?.id as string | undefined,
      from: selectedValue,
    },
    {
      enabled: !!params?.id,
    }
  );

  if (isFetching) {
    return null;
  }

  return (
    <>
      <div className="flex justify-end">
        <Controller
          control={control}
          name="from"
          render={({ field }) => (
            <Select onValueChange={field.onChange} {...field}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Project" />
              </SelectTrigger>
              <SelectContent>
                {SELECT_ITEMS.map((item) => (
                  <SelectItem key={item.value} value={item.value}>
                    {item.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}
        />
      </div>
      <Chart data={data?.series || []} />
      {/* @ts-ignore */}
      <Table data={data?.eventsa} />
    </>
  );
}
