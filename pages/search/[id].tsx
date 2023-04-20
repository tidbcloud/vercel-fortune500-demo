import Head from "next/head";
import { config } from "@/config";
import dynamic from "next/dynamic";

const SearchPage = dynamic(() => import("@/apps/search"), {
  ssr: false,
  loading: () => <p>Loading...</p>,
});

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
