import { Pico } from '../src/index'

const app = new Pico()

app.get('/', (c) => c.text('Hello Pico!'))
app.get('/entry/:id', (c) => {
  const id = c.req.param('id')
  return c.json({ 'your id is': id })
})
app.get('/money', () => new Response('Payment required', { status: 402 }))

export default app
