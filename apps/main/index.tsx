import { useState } from "react";
import Image from "next/image";
import { Button, Modal, Text, Stack } from "@mantine/core";
import { useRouter } from "next/router";
import { useMemoizedFn } from "ahooks";
import { TitleWithLogo } from "@/components/TitleWithLogo";
import { Footer } from "@/components/Footer";
import { UploadArea } from "./UploadArea";
import { eventTracking } from "@/lib/mixpanel";

export default function Home() {
  const [showUpload, setShowUpload] = useState(false);
  const [submitButtonText, setSubmitButtonText] = useState("Start Exploring");

  const router = useRouter();

  const onCancel = useMemoizedFn(() => {
    eventTracking("Cancel on Upload Dataset");
    setShowUpload(false);
  });

  const onSuccess = useMemoizedFn((id: string) => {
    eventTracking("Success on Upload Dataset");
    setSubmitButtonText("Redirecting...");
    router.push(`/search/${id}`);
  });

  return (
    <>
      <header className="header">
        <TitleWithLogo />
      </header>
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
          data-mp-event="Click Explore Dataset Button"
        >
          Explore any dataset
        </Button>
        <Text size={14} color="#777">
          You can also try our sample dataset:{" "}
          <a
            href="https://fortune500.vercel.app/"
            target="_blank"
            rel="noreferrer"
            data-mp-event="Click Explore fortune 500 Q&A Link"
          >
            Explore fortune 500 Q&A
          </a>
        </Text>

        <Image
          src="/demo.gif"
          height={360}
          width={800}
          alt=""
          className="demo-image"
        />
      </Stack>
      <Footer className="footer" />
      <Modal
        size="xl"
        opened={showUpload}
        onClose={() => setShowUpload(false)}
        title={<h4>Upload your dataset</h4>}
        centered
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
