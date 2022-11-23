import { Pico } from '../src/index'

const app = new Pico()

app.get('/', () => 'Hello Pico!')
app.get('/entry/:id', ({ pathname }) => {
  const { id } = pathname.groups
  return { 'your id is': id }
})

export default app
