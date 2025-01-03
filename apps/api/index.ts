import { Elysia } from 'elysia'

const app = new Elysia()

app.get('/', () => {
  return 'Hello from Elysia!'
})

app.listen(3001, () => {
  console.log('API server running on http://localhost:3001')
})