import { Elysia } from 'elysia';

const app = new Elysia();

app.get("/", () => "Hello, Elysia!");

export default app;