import * as React from "react";
import { Html, Head, Main, NextScript } from "next/document";
import { DocumentHeadTags, documentGetInitialProps } from "@mui/material-nextjs/v14-pagesRouter";
import theme from "../src/theme";
import { getInitColorSchemeScript } from "@mui/material";

export default function MyDocument(props) {
  return (
    <Html lang="en">
      <Head>
        {/* PWA primary color */}
        <meta name="theme-color" content={theme.vars.palette.primary.main} />
        <link rel="shortcut icon" href="/favicon.ico" />
        <meta name="emotion-insertion-point" content="" />
        {/* Open Graph Tags */}
        <meta property="og:title" content="DMAX" />
        <meta
          property="og:description"
          content="MHRiseの自動ダメージ最大化シミュレーターです。モンスターごとに最大ダメージを出す装備構成を自動で見つけてくれます。"
        />
        <meta property="og:type" content="website" />
        <meta property="og:url" content={`${process.env.NEXT_PUBLIC_API_BASE_URL}/dmax`} />
        <meta
          property="og:image"
          content={`${process.env.NEXT_PUBLIC_API_BASE_URL}/dmax/images/favicon.webp`}
        />
        <DocumentHeadTags {...props} />
      </Head>
      <body>
        {getInitColorSchemeScript()}
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}

MyDocument.getInitialProps = async (ctx) => {
  const finalProps = await documentGetInitialProps(ctx);
  return finalProps;
};
