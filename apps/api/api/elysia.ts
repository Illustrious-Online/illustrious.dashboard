import { Elysia } from "elysia";

const app = new Elysia();

app.get("/", () => {
  return "Hello from Elysia on Vercel Edge!";
});

// Export the app for Vercel's Edge Function
export default app;