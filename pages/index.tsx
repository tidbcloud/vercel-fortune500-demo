import Head from "next/head";
import { config } from "@/config";
import Main from "@/apps/main";

export default function Home() {
  return (
    <>
      <Head>
        <title>{config.title}</title>
        <meta
          name="description"
          content="explore your dataset with ai insight"
        />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <Main />
    </>
  );
}