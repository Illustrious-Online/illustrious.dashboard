import Elysia from "elysia";
import process from "process";
import { durationString, methodString } from "../utils/logger";

let colors: any;
import("yoctocolors").then((module) => {
  colors = module.default;
});

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

      logStr.push(methodString(request.method));
      logStr.push(new URL(request.url).pathname);

      const beforeTime: bigint = store.beforeTime;

      logStr.push(durationString(beforeTime));

      console.log(logStr.join(" "));
    })
    .onError({ as: "global" }, ({ request, error, store }) => {
      const logStr: string[] = [];

      logStr.push(colors.red(methodString(request.method)));
      logStr.push(new URL(request.url).pathname);
      logStr.push(colors.red("Error"));

      if ("status" in error) {
        logStr.push(String(error.status));
      }

      logStr.push(error instanceof Error ? error.message : 'Uknown Error');

      const beforeTime: bigint = store.beforeTime;
      logStr.push(durationString(beforeTime));

      console.log(logStr.join(" "));
    });
