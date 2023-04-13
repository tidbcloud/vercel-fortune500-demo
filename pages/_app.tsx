import type { AppProps } from "next/app";
import { Analytics } from "@vercel/analytics/react";
import { MantineProvider } from "@mantine/core";
import { TitleWithLogo } from "@/components/TitleWithLogo";
import { Footer } from "@/components/Footer";

// use pure css for fast initial page rendering
import "@/styles/globals.css";
import "@/styles/main.css";

export default function App({ Component, pageProps }: AppProps) {
  return (
    <>
      <MantineProvider
        theme={{
          fontFamily:
            "Inter, -apple-system, BlinkMacSystemFont, Segoe UI, Roboto, Arial, Noto Sans SC, Microsoft Yahei, sans-serif, Menlo, Consolas, monospace,Apple Color Emoji, Segoe UI Emoji, emoji, Helvetica Neue, Helvetica",
          fontFamilyMonospace: "Monaco, Courier, monospace",
        }}
      >
        <header className="header">
          <TitleWithLogo />
        </header>
        <Component {...pageProps} />
        <Footer className="footer" />
      </MantineProvider>
      <Analytics />
    </>
  );
}
