import createEmotionCache from "@emotion/cache";
import { CacheProvider as EmotionCacheProvider } from "@emotion/react";
import createEmotionServer from "@emotion/server/create-instance";
import { createReadableStreamFromReadable } from "@react-router/node";
import { isbot } from "isbot";
import { renderToPipeableStream } from "react-dom/server";
import { type EntryContext, ServerRouter } from "react-router";
import { PassThrough } from "stream";

const ABORT_DELAY = 5000;

export default function handleRequest(
  request: Request,
  responseStatusCode: number,
  responseHeaders: Headers,
  context: EntryContext,
) {
  return isbot(request.headers.get("user-agent"))
    ? handleBotRequest(request, responseStatusCode, responseHeaders, context)
    : handleBrowserRequest(
        request,
        responseStatusCode,
        responseHeaders,
        context,
      );
}

function handleBotRequest(
  request: Request,
  responseStatusCode: number,
  responseHeaders: Headers,
  context: EntryContext,
) {
  return new Promise((resolve, reject) => {
    let didError = false;
    const emotionCache = createEmotionCache({ key: "css" });

    const { pipe, abort } = renderToPipeableStream(
      <EmotionCacheProvider value={emotionCache}>
        <ServerRouter context={context} url={request.url} />
      </EmotionCacheProvider>,
      {
        onAllReady() {
          const body = new PassThrough();
          const emotionServer = createEmotionServer(emotionCache);

          const bodyWithStyles = emotionServer.renderStylesToNodeStream();
          body.pipe(bodyWithStyles);

          responseHeaders.set("Content-Type", "text/html");

          resolve(
            new Response(createReadableStreamFromReadable(body), {
              headers: responseHeaders,
              status: didError ? 500 : responseStatusCode,
            }),
          );

          pipe(body);
        },
        onShellError(error: unknown) {
          reject(error);
        },
        onError(error: unknown) {
          didError = true;

          console.error(error);
        },
      },
    );

    setTimeout(abort, ABORT_DELAY);
  });
}

function handleBrowserRequest(
  request: Request,
  responseStatusCode: number,
  responseHeaders: Headers,
  context: EntryContext,
) {
  return new Promise((resolve, reject) => {
    let didError = false;
    const emotionCache = createEmotionCache({ key: "css" });

    const { pipe, abort } = renderToPipeableStream(
      <EmotionCacheProvider value={emotionCache}>
        <ServerRouter context={context} url={request.url} />
      </EmotionCacheProvider>,
      {
        onShellReady() {
          const body = new PassThrough();
          const emotionServer = createEmotionServer(emotionCache);

          const bodyWithStyles = emotionServer.renderStylesToNodeStream();
          body.pipe(bodyWithStyles);

          responseHeaders.set("Content-Type", "text/html");

          resolve(
            new Response(createReadableStreamFromReadable(body), {
              headers: responseHeaders,
              status: didError ? 500 : responseStatusCode,
            }),
          );

          pipe(body);
        },
        onShellError(err: unknown) {
          reject(err);
        },
        onError(error: unknown) {
          didError = true;

          console.error(error);
        },
      },
    );

    setTimeout(abort, ABORT_DELAY);
  });
}
