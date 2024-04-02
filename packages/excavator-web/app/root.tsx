import { ChakraProvider, Container, Heading, Stack } from "@chakra-ui/react";
import { withEmotionCache } from "@emotion/react";
import { LinksFunction, MetaFunction } from "@remix-run/node";
import { Link, Links, Meta, Outlet, Scripts } from "@remix-run/react";
import React from "react";
import { useContext, useEffect } from "react";

import { ClientStyleContext, ServerStyleContext } from "./context.js";
import faviconUrl from "./favicon.png";
import { theme } from "./theme.js";

export const links: LinksFunction = () => [
  {
    rel: "icon",
    href: faviconUrl,
    type: "image/png",
  },
];

export const meta: MetaFunction = () => {
  return [
    { title: "Excavator ♠️" },
    {
      name: "viewport",
      content: "width=device-width,initial-scale=1",
    },
  ];
};

const Document = withEmotionCache(
  ({ children }: React.PropsWithChildren, emotionCache) => {
    const serverStyleData = useContext(ServerStyleContext);
    const clientStyleData = useContext(ClientStyleContext);

    // Only executed on client
    useEffect(() => {
      // re-link sheet container
      emotionCache.sheet.container = document.head;
      // re-inject tags
      const tags = emotionCache.sheet.tags;
      emotionCache.sheet.flush();
      tags.forEach((tag) => {
        (emotionCache.sheet as any)._insertTag(tag);
      });
      // reset cache to reapply global styles
      clientStyleData?.reset();
    }, []);

    return (
      <html lang="en">
        <head>
          <Meta />
          <Links />
          {serverStyleData?.map(({ key, ids, css }) => (
            <style
              key={key}
              data-emotion={`${key} ${ids.join(" ")}`}
              dangerouslySetInnerHTML={{ __html: css }}
            />
          ))}
        </head>
        <body>
          {children}
          <Scripts />
        </body>
      </html>
    );
  },
);

export default function App() {
  return (
    <Document>
      <ChakraProvider theme={theme}>
        <Container maxW="container.xl" pt={10}>
          <Stack spacing={10}>
            <Heading alignSelf="center">
              <Link to="/">Excavator ♠️</Link>
            </Heading>
            <Outlet />
          </Stack>
        </Container>
      </ChakraProvider>
    </Document>
  );
}
