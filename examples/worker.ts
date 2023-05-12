import { Pico } from '../src/index'

const router = Pico()

router.get('/', () => new Response('Hello Pico!'))
router.get('/entry/:id', ({ result }) => {
  const { id } = result.pathname.groups
  return Response.json({ 'your id is': id })
})
router.get('/money', () => new Response('Payment required', { status: 402 }))

router.all('*', () => new Response('Not Found', { status: 404 }))

export default router
