import { Pico } from '../src/index'

const app = new Pico()

app.get('/', () => 'Hello Pico!')
app.get('/entry/:id', ({ params }) => {
  const { id } = params
  return { 'your id is': id }
})
app.get('/money', ({ res }) => res('Payment required', { status: 402 }))

export default app
