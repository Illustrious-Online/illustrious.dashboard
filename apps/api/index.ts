import { Elysia } from "elysia";

const app = new Elysia();

app.get("/", () => {
  return "Hello from Elysia!";
});

export default app;