import Menu from "@/component/Menu";
import "@/styles/globals.css";
import type { AppProps } from "next/app";

export default function App({ Component, pageProps, router }: AppProps) {
  if(router.route === "/login") {
    return <Component {...pageProps} />
  }
  return (
    <>
      <Menu />
      <Component {...pageProps} />
    </>
  );
}
