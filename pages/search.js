import { useCallback, useEffect, useState } from "react";
import clsx from "clsx";
import Head from "next/head";
import Image from "next/image";
import { Content } from "@/components/Content";
import { Suggestions } from "@/components/Suggestions";
import { createStyles } from "@mantine/core";
import { config } from "@/config";
import { UploadBlock } from "@/components/UploadBlock";

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
  mainWithResult: {
    justifyContent: "flex-start",
  },
  content: {
    maxWidth: 1100,
    width: "100%",
    flex: 1,
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-around",
    "@media (max-width: 700px)": {
      marginTop: "2rem",
      padding: "1rem",
      justifyContent: "flex-start",
      gap: 24,
    },
  },
  block: {
  },
  bottomContent: {
    display: 'flex',
  },
  contentWithResult: {
    flexDirection: "row",
    gap: 40,
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
  const [showingResult, setShowingResult] = useState(false);
  const [question, setQuestion] = useState("");

  const handleSearch = useCallback((val) => {
    if (val) {
      setQuestion(val);
      setShowingResult(true);
    } else {
      setQuestion("");
      setShowingResult(false);
    }
  }, []);

  useEffect(() => {
    function setHeight() {
      const el = document.querySelector(".main");
      if (el) {
        el.style.minHeight = window.innerHeight + "px";
      }
    }
    const deviceWidth = window.matchMedia("(max-width: 700px)");
    if (deviceWidth.matches) {
      window.addEventListener("resize", setHeight);
      setHeight();
    }
  }, []);

  return (
    <>
      <Head>
        <title>{config.title}</title>
        <meta name="description" content="Generated by create next app" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main
        className={clsx(
          "main",
          classes.main,
          showingResult && classes.mainWithResult
        )}
      >
        <div
          className={clsx(
            classes.content,
            showingResult && classes.contentWithResult
          )}
        >
          <Content onSearch={handleSearch} searchValue={question} />

          <div className={classes.bottomContent}>
            <div className={classes.block}><Suggestions showingResult={showingResult} onSelect={handleSearch} /></div>
            <div className={classes.block}><UploadBlock /></div>
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
    </>
  );
}
