import Elysia from "elysia";
import process from "process";
import { durationString, methodString } from "../utils/logger";
import colors from "yoctocolors";

export default (app: Elysia) =>
  app
    .state({ beforeTime: process.hrtime.bigint(), as: "global" })
    .onRequest((ctx) => {
      ctx.store.beforeTime = process.hrtime.bigint();
    })
    .onBeforeHandle({ as: "global" }, (ctx) => {
      ctx.store.beforeTime = process.hrtime.bigint();
    })
    .onAfterHandle({ as: "global" }, ({ request, store }) => {
      const logStr: string[] = [];
      const requestUrl = request.url;

      // Check if the URL is valid
      if (requestUrl && isValidUrl(requestUrl)) {
        logStr.push(methodString(request.method));
        logStr.push(new URL(requestUrl).pathname);
      } else {
        logStr.push(methodString(request.method));
        logStr.push("Invalid URL");
      }

      const beforeTime: bigint = store.beforeTime;

      logStr.push(durationString(beforeTime));

      console.log(logStr.join(" "));
    })
    .onError({ as: "global" }, ({ request, error, store }) => {
      const logStr: string[] = [];

      logStr.push(colors.red(methodString(request.method)));

      const requestUrl = request.url;
      if (requestUrl && isValidUrl(requestUrl)) {
        logStr.push(new URL(requestUrl).pathname);
      } else {
        logStr.push("Invalid URL");
      }

      logStr.push(colors.red("Error"));

      if ("status" in error) {
        logStr.push(String(error.status));
      }

      logStr.push(error instanceof Error ? error.message : "Unknown Error");

      const beforeTime: bigint = store.beforeTime;
      logStr.push(durationString(beforeTime));

      console.log(logStr.join(" "));
    });

// Helper function to check if the URL is valid
function isValidUrl(url: string): boolean {
  try {
    new URL(url); // Try to create a new URL object
    return true;
  } catch (e) {
    return false;
  }
}
