import React from "react";
import Head from "next/head";
import Game from "../components/Game";

export default function Home() {
  const windowWidth = window.innerWidth;

  return (
    <>
      <Head>
        <meta charSet="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>Speed Typer</title>
        <link
          href="https://cdn.jsdelivr.net/npm/remixicon@2.5.0/fonts/remixicon.css"
          rel="stylesheet"
        />
        <meta
          name="description"
          content="A desktop speed-typing game based around fifty-word stories written by authors from all walks of life."
        />
      </Head>

      {windowWidth > 876 ? <Game /> : <p>Too small</p>}
    </>
  );
}
