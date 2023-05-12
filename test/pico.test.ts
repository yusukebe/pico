import { Pico } from '../src/pico'

const json = (data: unknown) =>
  new Response(JSON.stringify(data), {
    headers: {
      'Content-Type': 'application/json',
    },
  })

describe('Basic', () => {
  const router = Pico()
  router.get('/', () => new Response('Hi'))
  router.get('/json', () =>
    json({
      message: 'hello',
    })
  )
  router.get('*', () => {
    return new Response('Custom Not Found', {
      status: 404,
    })
  })

  it('Should return 200 text response', async () => {
    const req = new Request('http://localhost')
    const res = await router.fetch(req)
    expect(res).not.toBeUndefined()
    expect(res.status).toBe(200)
    expect(res.headers.get('Content-Type')).toMatch(/^text\/plain/)
    expect(await res.text()).toBe('Hi')
  })

  it('Should return 200 JSON response', async () => {
    const req = new Request('http://localhost/json')
    const res = await router.fetch(req)
    expect(res).not.toBeUndefined()
    expect(res.status).toBe(200)
    expect(res.headers.get('Content-Type')).toBe('application/json')
    expect(await res.json()).toEqual({ message: 'hello' })
  })

  it('Should return 404 response', async () => {
    const req = new Request('http://localhost/not-found')
    const res = await router.fetch(req)
    expect(res.status).toBe(404)
    expect(await res.text()).toBe('Custom Not Found')
  })
})

describe('RegExp', () => {
  const router = Pico()
  router.get('/post/:date(\\d+)/:title([a-z]+)', ({ result }) => {
    const { date, title } = result.pathname.groups
    return json({
      post: {
        date,
        title,
      },
    })
  })

  router.get('/assets/:filename(.*.png)', (c) => {
    const filename = c.result.pathname.groups['filename']
    return json({ filename })
  })

  it('Should capture regexp path parameters', async () => {
    const req = new Request('http://localhost/post/20221124/hello')
    const res = await router.fetch(req)
    expect(res).not.toBeUndefined()
    expect(res.status).toBe(200)
    expect(await res.json()).toEqual({ post: { date: '20221124', title: 'hello' } })
  })

  it('Should return nothing', async () => {
    const req = new Request('http://localhost/post/onetwothree/hello')
    const res = await router.fetch(req)
    expect(res).toBeUndefined()
  })

  it('Should capture the path parameter with the wildcard', async () => {
    const req = new Request('http://localhost/assets/animal.png')
    const res = await router.fetch(req)
    expect(res).not.toBeUndefined()
    expect(res.status).toBe(200)
    expect(await res.json()).toEqual({ filename: 'animal.png' })
  })
})

describe('Query', () => {
  const app = Pico()
  app.get('/search', ({ result }) => {
    const query = new URLSearchParams(result.search.input).get('q')
    return new Response(query)
  })

  it('Should get query parameters', async () => {
    const req = new Request('http://localhost/search?q=foo')
    const res = await app.fetch(req)
    expect(res.status).toBe(200)
    expect(await res.text()).toBe('foo')
  })
})

describe('All', () => {
  const router = Pico()
  router.all('/abc', () => new Response('Hi'))

  it('Should return 200 response with GET request', async () => {
    const req = new Request('http://localhost/abc')
    const res = await router.fetch(req)
    expect(res).not.toBeUndefined()
    expect(res.status).toBe(200)
  })

  it('Should return 200 response with POST request', async () => {
    const req = new Request('http://localhost/abc', { method: 'POST' })
    const res = await router.fetch(req)
    expect(res).not.toBeUndefined()
    expect(res.status).toBe(200)
  })
})

describe('on', () => {
  const router = Pico()
  router.on('PURGE', '/cache', () => new Response('purged'))

  it('Should return 200 response with PURGE method', async () => {
    const req = new Request('http://localhost/cache', { method: 'PURGE' })
    const res = await router.fetch(req)
    expect(res).not.toBeUndefined()
    expect(res.status).toBe(200)
  })
})
