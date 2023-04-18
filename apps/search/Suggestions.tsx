import {
  Alert,
  Skeleton,
  Stack,
  Group,
  Text,
  UnstyledButton,
  Modal,
  Divider,
} from "@mantine/core";
import { IconAlertCircle, IconArrowRight } from "@tabler/icons";
import useSWR from "swr";
import { useRouter } from "next/router";
import { useMemoizedFn } from "ahooks";
import {
  TwitterShareButton,
  TwitterIcon,
  FacebookShareButton,
  FacebookIcon,
} from "react-share";
import { useState } from "react";
import { fetcher } from "@/lib/fetch";
import type { Chat2questionResponse } from "@/lib/api";
import { capitalize } from "@/lib/utils";
import { UploadArea } from "../main/UploadArea";
import { SelfHostInstruction } from "./SelfHostInstruction";

export const Suggestions: React.FC<{
  onSelect?: (val: string) => void;
}> = ({ onSelect }) => {
  const [uploadModal, setUploadModal] = useState(false);
  const [selfHostModal, setSelfHostModal] = useState(false);
  const router = useRouter();
  const id = router.query.id;
  const { data, isLoading, error } = useSWR<Chat2questionResponse>(
    id ? `/api/suggest?id=${id}` : null,
    fetcher,
    {
      revalidateOnFocus: false,
      revalidateOnReconnect: false,
      shouldRetryOnError: false,
    }
  );

  const isError = error || (data && data?.code !== 200);
  const shareURL = typeof window !== "undefined" ? window.location.href : "";
  const shareQuote = "AI Insight exploration!";
  const shareHashtags = ["tidbcloud", "tidb", "aiinsight"];

  const onCancel = useMemoizedFn(() => {
    setUploadModal(false);
  });

  const onSuccess = useMemoizedFn((id: string) => {
    setUploadModal(false);
    router.push(`/search/${id}`);
  });

  return (
    <Stack spacing={24} sx={{ width: 290, flexShrink: 0 }}>
      <Stack spacing={4}>
        <Text fw={700} size={20} color="#666666">
          You may ask
        </Text>

        <Stack spacing={24}>
          {isError && (
            <Alert
              title="Ooops, error occurred"
              icon={<IconAlertCircle size={16} />}
              color="red"
            >
              Failed to load suggestions: {error?.message ?? data?.message}
            </Alert>
          )}

          {isLoading
            ? [1, 2, 3, 4].map((i) => (
                <Stack key={i} spacing={4}>
                  <Skeleton height={28} width={80} />
                  <Skeleton height={14} />
                  <Skeleton height={14} width="90%" />
                </Stack>
              ))
            : data?.questions?.map((v) => (
                <Stack
                  key={v.question}
                  onClick={() => onSelect?.(v.question)}
                  spacing={4}
                  sx={{ cursor: "pointer" }}
                >
                  <h2>
                    <Group spacing={4}>
                      {capitalize(v.question_keyword)} <IconArrowRight />
                    </Group>
                  </h2>
                  <Text sx={{ opacity: 0.6, lineHeight: "1.5" }} size={14}>
                    {v.question}
                  </Text>
                </Stack>
              ))}
        </Stack>
      </Stack>

      <Stack spacing={4}>
        <Text fw={700} size={20} color="#666666">
          You may want
        </Text>

        <UnstyledButton onClick={() => setSelfHostModal(true)}>
          <Text size={14} color="#0CA6F2" span>
            Build you own site
          </Text>
        </UnstyledButton>
        <UnstyledButton onClick={() => setUploadModal(true)}>
          <Text size={14} color="#0CA6F2" span>
            Upload another dataset
          </Text>
        </UnstyledButton>
      </Stack>

      <Stack spacing={4}>
        <Text fw={700} size={16} color="#666666">
          Share with friends
        </Text>

        <Group>
          <TwitterShareButton
            url={shareURL}
            title={shareQuote}
            hashtags={shareHashtags}
          >
            <TwitterIcon size={32} round />
          </TwitterShareButton>
          <FacebookShareButton
            url={shareURL}
            quote={shareQuote}
            hashtag={shareHashtags.join(" ")}
          >
            <FacebookIcon size={32} round />
          </FacebookShareButton>
        </Group>
      </Stack>

      <Modal
        opened={selfHostModal}
        onClose={() => setSelfHostModal(false)}
        size="xl"
        title={
          <h3 style={{ paddingLeft: 20, paddingTop: 12 }}>
            Build your own AI Insight
          </h3>
        }
        padding={0}
        withCloseButton={false}
      >
        <Divider />
        <SelfHostInstruction />
      </Modal>

      <Modal
        opened={uploadModal}
        onClose={() => setUploadModal(false)}
        size="xl"
        title={<h4>Upload</h4>}
      >
        <UploadArea onSuccess={onSuccess} onCancel={onCancel} />
      </Modal>
    </Stack>
  );
};
