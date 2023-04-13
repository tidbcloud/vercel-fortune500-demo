import Head from "next/head";
import { config } from "@/config";
import SearchPage from "@/apps/search";

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

      <SearchPage />
    </>
  );
}
