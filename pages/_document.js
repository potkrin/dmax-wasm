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
