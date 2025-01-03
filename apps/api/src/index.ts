import { Elysia, t } from 'elysia'

const app = new Elysia()
  .get('/', () => 'Hi Elysia')
  .get('/id/:id', ({ params: { id } }) => id)
  .post('/mirror', ({ body }) => body, {
      body: t.Object({
          id: t.Number(),
          name: t.String()
      })
  })
  .listen(3000);

console.log(
  `🦊 Elysia is running at ${app.server?.hostname}:${app.server?.port}`
);

export type App = typeof app 