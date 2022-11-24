import { Pico } from '../src/index'

const app = new Pico()

app.get('/', () => 'Hello Pico!')
app.get('/entry/:id', ({ params }) => {
  const { id } = params
  return { 'your id is': id }
})

export default app
