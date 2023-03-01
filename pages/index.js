import { useState } from "react";
import Head from "next/head";
import Image from "next/image";
import { Button, createStyles, Modal, Group, Text, Alert } from "@mantine/core";
import { Dropzone } from "@mantine/dropzone";
import { config } from "@/config";
import TitleWithLogo from "@/components/TitleWithLogo";
import { IconUpload, IconPhoto, IconX } from "@tabler/icons";
import { useRouter } from "next/router";
import { IconAlertCircle } from "@tabler/icons";
import { useFullScreen } from "@/lib/hook";

const useStyles = createStyles(() => ({
  main: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    paddingTop: "4rem",
    paddingBottom: "4rem",
    minHeight: "100vh",
    "@media (max-width: 700px)": {
      padding: "0 0 2rem",
    },
  },
  subTitle: {
    color: "#666666",
    fontSize: 20,
    fontWeight: 700,
    marginBottom: 24,
    position: "relative",
  },
  titleIcon: {
    position: "absolute",
    left: -40,
    top: -4,
  },
  paragraph: {
    fontSize: 16,
    color: "#777777",
    marginBottom: 24,
  },
  block: {
    width: 500,
    paddingTop: 100,
    display: "flex",
    flexDirection: "column",
    "@media (max-width: 700px)": {
      padding: "0 100px",
      marginTop: 50,
    },
  },
  line: {
    height: 300,
    borderLeft: `1px solid #666666`,
    margin: 24 + 50,

    "@media (max-width: 700px)": {
      display: "none",
    },
  },
  preview: {
    position: "relative",
    minHeight: 200,
    flex: 1,
  },
  content: {
    display: "flex",
    marginTop: 0,
    "@media (max-width: 700px)": {
      flexDirection: "column",
    },
  },
  link: {
    display: "flex",
    alignItems: "center",
    lineHeight: "16px",
    gap: 8,
    "@media (max-width: 700px)": {
      transform: "scale(0.75)",
    },
  },
  footer: {
    marginTop: 24,
  },
}));

export default function Home() {
  const { classes } = useStyles();
  const [showUpload, setShowUpload] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [errMsg, setErrMsg] = useState("");
  const router = useRouter();

  useFullScreen();

  const upload = (files) => {
    if (!files?.[0]) {
      return;
    }
    setUploading(true);
    const reader = new FileReader();

    reader.onload = (e) => {
      setErrMsg("");

      const data = {
        filename: files[0].name,
        content: e.target.result,
      };

      fetch(`/api/upload`, {
        method: "POST",
        body: JSON.stringify(data),
        headers: {
          "Content-Type": "application/json",
        },
      }).then((res) => {
        res.json().then((result) => {
          if (res.status !== 200) {
            setErrMsg(result.message);
          }
          setUploading(false);
          if (result?.data?.id) {
            router.push(`/search?id=${result.data.id}`);
          }
        });
      });
    };
    reader.readAsText(files[0]);
  };

  return (
    <>
      <Head>
        <title>{config.title}</title>
        <meta name="description" content="Generated by create next app" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className={classes.main}>
        <TitleWithLogo />

        <div className={classes.content}>
          <div className={classes.block}>
            <div className={classes.subTitle}>
              <Image
                src="/upload.svg"
                alt="Upload"
                width={32}
                height={32}
                className={classes.titleIcon}
              />
              Step 1. Upload a CSV file
            </div>
            <div className={classes.paragraph}>
              Upload a CSV file, then ask questions by natural language
            </div>
            <Button
              style={{ marginBottom: 24 }}
              onClick={() => setShowUpload(true)}
            >
              Explore any dataset
            </Button>
            <div className={classes.paragraph}>
              Don&apos;t have a CSV file? You can try our sample dataset about
              fortune 500
            </div>
            <Button
              variant="light"
              onClick={() =>
                (window.location.href = `https://fortune500.vercel.app/`)
              }
            >
              Explore fortune 500
            </Button>
          </div>
          <div className={classes.line}></div>
          <div className={classes.block}>
            <div className={classes.subTitle}>
              <Image
                src="/ai.svg"
                alt="Upload"
                width={32}
                height={32}
                className={classes.titleIcon}
              />
              Step 2. Ask questions from it
            </div>
            <div className={classes.preview}>
              <Image
                src="/demo.gif"
                alt="demo"
                // width="100%"
                fill
                // height={272}
                style={{ border: `1px solid #DFDFDF`, objectFit: "contain" }}
              />
            </div>
          </div>
        </div>

        <footer className={classes.footer}>
          <a
            className={classes.link}
            href="https://tidbcloud.com/?utm_source=smartchart&utm_medium=referral"
            target="_blank"
            rel="noopener noreferrer"
          >
            Powered by{" "}
            <Image
              src="/tidb.svg"
              alt="TiDB Cloud Logo"
              width={138}
              height={24}
              priority
            />
          </a>
        </footer>
      </main>

      <Modal
        opened={showUpload}
        onClose={() => setShowUpload(false)}
        title="Explore your own dataset!"
      >
        {errMsg && (
          <Alert
            icon={<IconAlertCircle size={16} />}
            color="red"
            style={{ marginBottom: 24 }}
          >
            {errMsg}
          </Alert>
        )}
        <Dropzone
          onDrop={(files) => upload(files)}
          onReject={(files) => console.log("rejected files", files)}
          accept={{ "text/csv": [".csv"] }}
          maxSize={1 * 1024 ** 2}
          loading={uploading}
        >
          <Group
            position="center"
            spacing="xl"
            style={{ minHeight: 220, pointerEvents: "none" }}
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
                Drag the CSV file here or click to select one CSV file
              </Text>
              <Text size="sm" color="dimmed" inline mt={7}>
                Attach only one file please, do not exceed 1mb
              </Text>
            </div>
          </Group>
        </Dropzone>
      </Modal>
    </>
  );
}
