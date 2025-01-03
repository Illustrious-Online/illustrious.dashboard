import { Elysia } from 'elysia';

const app = new Elysia();

app.get("/", () => "Hello, Elysia!");

app.listen(3000).then(() => {
  console.log("Server started on http://localhost:3000");
});