import { Elysia } from "elysia";

const app = new Elysia().get("/", () => "Hello Elysia");

console.log(
  `🦊 Elysia is running at ${app.server?.hostname}:${app.server?.port}`
);

export default app.fetch;
