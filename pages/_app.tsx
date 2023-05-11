import type { AppProps } from "next/app";
import { MantineProvider } from "@mantine/core";
import { enableAutoClickTracking } from "@/lib/mixpanel";

// use pure css for fast initial page rendering
import "@/styles/globals.css";
import "@/styles/main.css";
import { useEffect } from "react";

export default function App({ Component, pageProps }: AppProps) {
  useEffect(() => {
    return enableAutoClickTracking();
  }, []);

  return (
    <>
      <MantineProvider
        theme={{
          fontFamily:
            "Inter, -apple-system, BlinkMacSystemFont, Segoe UI, Roboto, Arial, Noto Sans SC, Microsoft Yahei, sans-serif, Menlo, Consolas, monospace,Apple Color Emoji, Segoe UI Emoji, emoji, Helvetica Neue, Helvetica",
          fontFamilyMonospace: "Monaco, Courier, monospace",
        }}
      >
        <Component {...pageProps} />
      </MantineProvider>
    </>
  );
}
