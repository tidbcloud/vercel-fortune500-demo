import { Button, Group, Text, Alert, Stack } from "@mantine/core";
import { Dropzone } from "@mantine/dropzone";
import { IconUpload, IconPhoto, IconX } from "@tabler/icons";
import { IconAlertCircle } from "@tabler/icons";
import { useMemoizedFn, useUnmount } from "ahooks";
import React, { useEffect, useState } from "react";
import { snakeCase } from "lodash-es";
import { isNumeric } from "@/lib/utils";
import { parse } from "@/lib/csv";
import { FilePreview } from "@/components/Preview";
import type { ColumnDescription, ColumnMatchingResponse } from "@/lib/api";
import useSWR from "swr";
import { fetcher } from "@/lib/fetch";

export const UploadArea: React.FC<{
  onSuccess?: (id: string) => void;
  onCancel?: () => void;
  confirmText?: string;
}> = ({ onSuccess, onCancel, confirmText = "Submit" }) => {
  const [uploading, setUploading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [errMsg, setErrMsg] = useState("");
  const [content, setContent] = useState("");
  const [filename, setFilename] = useState("");
  const [columns, setColumns] = useState<ColumnDescription[] | null>();
  const [jobId, setJobId] = useState("");

  const { data } = useSWR(
    jobId ? "/api/columns" : null,
    (key) =>
      fetcher(key, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ job_id: jobId }),
      }),
    {
      refreshInterval: (data) => (data?.status === 2 ? 0 : 200),
    }
  );

  useEffect(() => {
    if (data?.result?.columns) {
      setColumns((prev) =>
        data.result.columns
          .map((i: ColumnDescription) => ({
            ...i,
            column: snakeCase(i.column),
            isLoading: !i.column || !i.type,
          }))
          .concat(prev?.slice(data.result.columns.length))
      );
    }
  }, [data]);

  const onUpload = useMemoizedFn(async (files: File[]) => {
    if (!files?.[0]) {
      return;
    }

    const reader = new FileReader();
    reader.onload = async () => {
      setErrMsg("");
      const content = reader.result as string;
      let columns: any[], data: any;
      try {
        [columns, data] = await parse(content);
      } catch (e) {
        [columns, data] = await parse(content, { delimiter: ";" });
      }

      if (columns.some((i) => isNumeric(i))) {
        setErrMsg("It seems this file does not contain valid header");
        setUploading(false);
        return;
      }

      setColumns(
        columns.map((i) => ({
          column: snakeCase(i),
          type: "",
          description: "",
          isLoading: true,
        }))
      );
      setContent(content);
      setFilename(files[0].name);

      fetch("/api/columns", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          async: true,
          sample_data: [
            columns
              .map((i, index) => ({ [i]: data[0][index] }))
              .reduce((acc, next) => ({ ...acc, ...next }), {}),
          ],
        }),
      })
        .then((res) => res.json())
        .then((res: ColumnMatchingResponse) => {
          if (res.code !== 200) {
            setErrMsg(res.message || "Error occurred");
            return;
          }
          setJobId(res.job_id ?? "");
        })
        .catch((err) => setErrMsg(err.message || "Error occurred"))
        .finally(() => {
          setUploading(false);
        });
    };
    reader.onerror = () => {
      setUploading(false);
    };

    reader.readAsText(files[0]);
    setUploading(true);
  });

  const onSubmit = useMemoizedFn(() => {
    setSubmitting(true);
    setErrMsg("");
    fetch(`/api/upload`, {
      method: "POST",
      body: JSON.stringify({
        filename: filename,
        columns: columns,
        content: content,
      }),
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((res) => res.json())
      .then((res) => {
        if (res?.data?.id) {
          onSuccess?.(res.data.id);
        } else {
          throw new Error(res.message);
        }
      })
      .catch((err) => {
        setErrMsg(err.message);
      })
      .finally(() => {
        setSubmitting(false);
      });
  });

  useUnmount(() => {
    setFilename("");
    setColumns(null);
    setContent("");
    setErrMsg("");
  });

  return (
    <Stack>
      {errMsg && (
        <Alert title="Error" icon={<IconAlertCircle size={16} />} color="red">
          {errMsg}
        </Alert>
      )}
      {columns ? (
        <>
          <FilePreview columns={columns} onChange={(c) => setColumns(c)} />

          <Group position="center">
            <Button variant="default" onClick={onCancel}>
              Cancel
            </Button>
            <Button
              onClick={onSubmit}
              loading={submitting || columns.some((i) => i.isLoading)}
            >
              {confirmText}
            </Button>
          </Group>
        </>
      ) : (
        <Dropzone
          onDrop={(files) => onUpload(files)}
          onReject={(files) => console.log("rejected files", files)}
          accept={{ "text/csv": [".csv"] }}
          maxSize={1024 ** 2}
          loading={uploading}
        >
          <Group
            position="center"
            spacing="xl"
            style={{ height: 150, pointerEvents: "none" }}
          >
            <Dropzone.Accept>
              <IconUpload size={50} stroke={1.5} />
            </Dropzone.Accept>
            <Dropzone.Reject>
              <IconX size={50} stroke={1.5} />
            </Dropzone.Reject>
            <Dropzone.Idle>
              <IconPhoto size={50} stroke={1.5} />
            </Dropzone.Idle>
            <div>
              <Text size="xl" inline>
                Drag and drop a CSV file here or click to select one to start
                upload
              </Text>
              <Text size="sm" color="dimmed" inline mt={7}>
                Only one file less than 1MiB is supported.
              </Text>
            </div>
          </Group>
        </Dropzone>
      )}
    </Stack>
  );
};
