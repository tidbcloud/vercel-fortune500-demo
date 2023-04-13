import { useMemoizedFn } from "ahooks";
import { useEffect, useState } from "react";
import useSWR from "swr";
import useSWRMutation from "swr/mutation";
import { useRouter } from "next/router";
import { createStyles, Tabs } from "@mantine/core";
import { SearchResult } from "@/components/SearchResult";
import { Input } from "@/components/Input";
import { fetcher } from "@/lib/fetch";
import {
  Chat2chartResponse,
  ColumnDescription,
  GetColumnsDescriptionResponse,
} from "@/lib/api";
import { FilePreview } from "@/components/Preview";

const useStyles = createStyles({
  content: {
    maxWidth: 1200,
    width: "100%",
    display: "flex",
    flexDirection: "column",
    gap: 16,
  },
  input: {
    width: "100%",
    display: "flex",
    justifyContent: "center",
  },
  result: {
    width: "100%",
  },
});

export const Content: React.FC<{
  searchValue: string;
  onSearch: (v: string) => void;
}> = ({ onSearch, searchValue }) => {
  const { classes } = useStyles();
  const [loadingText, setLoadingText] = useState("Analyzing question");
  const [query, setQuery] = useState("");
  const router = useRouter();
  const id = router.query.id;
  const [tab, setTab] = useState<"columns" | "result">("columns");
  const { trigger, isMutating } = useSWRMutation(
    "/api/columns",
    (url, option: { arg: ColumnDescription & { id: string } }) =>
      fetcher(url, {
        method: "PUT",
        body: JSON.stringify(option.arg),
        headers: {
          "Content-Type": "application/json",
        },
      })
  );

  const { data: columnsData } = useSWR<GetColumnsDescriptionResponse>(
    id ? `/api/columns?id=${id}` : null,
    fetcher,
    {
      revalidateOnFocus: false,
      revalidateOnReconnect: false,
    }
  );

  const { data, isLoading, error } = useSWR<Chat2chartResponse>(
    query ? `/api/search?q=${query}${id ? `&id=${id}` : ""}` : null,
    fetcher,
    {
      revalidateOnFocus: false,
      revalidateOnReconnect: false,
      shouldRetryOnError: false,
      onSuccess() {
        setLoadingText("Analyzing question");
      },
      onLoadingSlow() {
        setLoadingText("Calculating and summarizing");
      },
    }
  );

  const onConfirm = useMemoizedFn((val: string) => {
    setQuery(val);
    onSearch(val);
  });

  const handleColumnChange = useMemoizedFn((column) => {
    trigger({
      ...column,
      id,
    });
  });

  useEffect(() => {
    if (searchValue) {
      setTab("result");
    }
  }, [searchValue]);

  return (
    <div className={classes.content}>
      <Input onConfirm={onConfirm} value={searchValue} />

      <Tabs
        value={tab}
        onTabChange={(val) => setTab(val as any)}
        variant="outline"
        sx={{ position: "relative" }}
      >
        <Tabs.List>
          <Tabs.Tab value="columns">Dataset Details</Tabs.Tab>
          <Tabs.Tab value="result">Result</Tabs.Tab>
        </Tabs.List>
        <Tabs.Panel value="columns" pt="xs">
          <FilePreview
            columns={columnsData?.data}
            onRowChange={handleColumnChange}
            loading={isMutating}
          />
        </Tabs.Panel>
        <Tabs.Panel value="result" pt="xs">
          <SearchResult
            className={classes.result}
            isLoading={isLoading}
            loadingText={loadingText}
            result={data}
            error={error}
          />
        </Tabs.Panel>
      </Tabs>
    </div>
  );
};
