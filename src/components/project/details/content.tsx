"use client";

import { useParams } from "next/navigation";
import { trpc } from "~/lib/trpc/client";
import { Chart } from "./chart";
import { Table } from "./table";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/components/ui/select";
import { useMemo } from "react";

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
  apiKey: z.string().optional(),
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
  const selectedApiKey = watch("apiKey");
  const selectedDateValue = Number(watch("from"));
  const id = params?.id;
  const { data: apiKeys } = trpc.project.getApiKeys.useQuery({
    id: id as string,
  });
  const { data, isFetching, isLoading } =
    trpc.project.getProjectActivity.useQuery({
      id: id as string,
      from: selectedDateValue,
      apiKey: selectedApiKey,
    });

  const apiKeysSelectItems = useMemo(
    () =>
      apiKeys
        ? apiKeys.map((apiKey) => ({
            label: apiKey.name,
            value: apiKey.id,
          }))
        : [],
    [apiKeys]
  );
  const selectedKeyName = useMemo(
    () =>
      selectedApiKey
        ? apiKeys?.find((apiKey) => apiKey.id === selectedApiKey)?.name
        : undefined,
    [selectedApiKey]
  );

  if (isFetching || isLoading) {
    return null;
  }

  return (
    <>
      <div className="flex gap-2 justify-end">
        <Controller
          control={control}
          name="apiKey"
          render={({ field }) => (
            <Select onValueChange={field.onChange} {...field}>
              <SelectTrigger className="w-64">
                <SelectValue placeholder="Select API Key" />
              </SelectTrigger>
              <SelectContent>
                {apiKeysSelectItems.map((item) => (
                  <SelectItem key={item.value} value={item.value}>
                    {item.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}
        />
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
      <Chart
        series={data?.series || []}
        keyNames={data?.keyNames || []}
        selectedApiKey={selectedKeyName}
      />
      <Table data={data?.events} />
    </>
  );
}
