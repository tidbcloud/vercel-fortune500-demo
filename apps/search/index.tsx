import { useMemoizedFn, useMount } from "ahooks";
import { useRouter } from "next/router";
import { useState } from "react";
import { Flex } from "@mantine/core";
import { useMediaQuery } from "@mantine/hooks";
import { TitleWithLogo } from "@/components/TitleWithLogo";
import { Footer } from "@/components/Footer";
import { Content } from "./Content";
import { Suggestions } from "./Suggestions";

export default function SearchPage() {
  const [question, setQuestion] = useState("");
  const router = useRouter();

  const handleSearch = useMemoizedFn((val: string) => {
    if (val) {
      setQuestion(val);
      router.query.q = val;
      router.push(router);
    } else {
      setQuestion("");
    }
  });

  const matches = useMediaQuery("(max-width: 700px)");

  useMount(() => {
    if (!router.isReady) return;

    const q = router.query.q;
    if (q && typeof q === "string") {
      setQuestion(q);
    }
  });

  return (
    <>
      <header className="header">
        <TitleWithLogo />
      </header>
      <Flex
        direction={matches ? "column" : "row"}
        sx={{
          flex: "1 0 auto",
          width: "80%",
          maxWidth: 1400,
          margin: "auto",
          gap: 48,
        }}
      >
        <Content onSearch={handleSearch} searchValue={question} />
        <Suggestions onSelect={handleSearch} />
      </Flex>
      <Footer className="footer" />
    </>
  );
}
