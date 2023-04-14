import { useState } from "react";
import Image from "next/image";
import { Button, Modal, Text, Stack } from "@mantine/core";
import { useRouter } from "next/router";
import { useMemoizedFn } from "ahooks";
import { UploadArea } from "./UploadArea";

export default function Home() {
  const [showUpload, setShowUpload] = useState(false);
  const [submitButtonText, setSubmitButtonText] = useState("Submit");

  const router = useRouter();

  const onCancel = useMemoizedFn(() => {
    setShowUpload(false);
  });

  const onSuccess = useMemoizedFn((id: string) => {
    setSubmitButtonText("Redirecting...");
    router.push(`/search/${id}`);
  });

  return (
    <>
      <Stack className="content" align="center">
        <Text size={50} fw={700}>
          Explore your dataset
        </Text>
        <Text size={16} color="#777">
          Upload a CSV file, then ask questions by natural language
        </Text>
        <Button
          leftIcon={<Image src="/star.svg" height={16} width={16} alt="" />}
          onClick={() => setShowUpload(true)}
        >
          Explore any dataset
        </Button>
        <Text size={14} color="#777">
          You can also try our sample dataset:{" "}
          <a
            href="https://fortune500.vercel.app/"
            target="_blank"
            rel="noreferrer"
          >
            Explore fortune 500 Q&A
          </a>
        </Text>

        <img src="https://placehold.co/800x480" alt="" />
      </Stack>

      <Modal
        size="xl"
        opened={showUpload}
        onClose={() => setShowUpload(false)}
        title={<h4>Upload</h4>}
      >
        <UploadArea
          confirmText={submitButtonText}
          onSuccess={onSuccess}
          onCancel={onCancel}
        />
      </Modal>
    </>
  );
}
