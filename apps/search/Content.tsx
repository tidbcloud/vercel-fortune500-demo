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
import { eventTracking } from "@/lib/mixpanel";

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
        eventTracking("Search with Query Successful");
        setLoadingText("Analyzing question");
      },
      onLoadingSlow() {
        setLoadingText("Calculating and summarizing");
      },
      onError(error) {
        eventTracking("Search with Query Error", { error });
      },
    }
  );

  const onConfirm = useMemoizedFn((val: string) => {
    eventTracking("Start Search with Query", { query: val });
    setQuery(val);
    onSearch(val);
  });

  const handleColumnChange = useMemoizedFn((column) => {
    eventTracking("Edit Column Description");
    trigger({
      ...column,
      id,
    });
  });

  useEffect(() => {
    if (searchValue) {
      setTab("result");
    } else {
      setTab("columns");
    }
  }, [searchValue]);

  return (
    <div className={classes.content}>
      <Input onConfirm={onConfirm} value={searchValue} />

      <Tabs
        value={tab}
        onTabChange={(val) => {
          eventTracking("Search Result Tab Change", { selectTab: val });
          setTab(val as any);
        }}
        sx={{ position: "relative" }}
        styles={{ tabsList: { display: "inline-flex" } }}
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
