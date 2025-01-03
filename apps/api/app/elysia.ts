import { Elysia } from 'elysia'

const app = new Elysia()

app.get('/', () => 'Hello from Elysia deployed on Vercel!')

export default app