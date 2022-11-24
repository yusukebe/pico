import { Pico } from '../src/pico'

describe('Basic', () => {
  const app = new Pico()
  app.get('/', () => 'Hi')
  app.get('/json', () => ({
    message: 'hello',
  }))
  app.get('*', () => {
    return new Response('Custom Not Found', {
      status: 404,
    })
  })

  it('Should return 200 text response', async () => {
    const req = new Request('http://localhost')
    const res = app.fetch(req)
    expect(res.status).toBe(200)
    expect(await res.text()).toBe('Hi')
  })

  it('Should return 200 JSON response', async () => {
    const req = new Request('http://localhost/json')
    const res = app.fetch(req)
    expect(res.status).toBe(200)
    expect(await res.json()).toEqual({ message: 'hello' })
  })

  it('Should return 404 response', async () => {
    const req = new Request('http://localhost/not-found')
    const res = app.fetch(req)
    expect(res.status).toBe(404)
    expect(await res.text()).toBe('Custom Not Found')
  })
})

describe('RegExp', () => {
  const app = new Pico()
  app.get('/post/:date(\\d+)/:title([a-z]+)', ({ params }) => {
    const { date, title } = params
    return { post: { date, title } }
  })
  app.get('/assets/:filename(.*.png)', ({ params }) => {
    return params
  })

  it('Should capture regexp path parameters', async () => {
    const req = new Request('http://localhost/post/20221124/hello')
    const res = app.fetch(req)
    expect(res.status).toBe(200)
    expect(await res.json()).toEqual({ post: { date: '20221124', title: 'hello' } })
  })

  it('Should return 404 response', async () => {
    const req = new Request('http://localhost/post/onetwothree/hello')
    const res = app.fetch(req)
    expect(res.status).toBe(404)
  })

  it('Should capture the path parameter with the wildcard', async () => {
    const req = new Request('http://localhost/assets/animal.png')
    const res = app.fetch(req)
    expect(res.status).toBe(200)
    expect(await res.json()).toEqual({ filename: 'animal.png' })
  })
})

describe('URL', () => {
  const app = new Pico()
  app.get('/search', ({ url }) => {
    const query = url.searchParams.get('q') || ''
    return query
  })

  it('Should get query parameters', async () => {
    const req = new Request('http://localhost/search?q=foo')
    const res = app.fetch(req)
    expect(res.status).toBe(200)
    expect(await res.text()).toBe('foo')
  })
})

describe('All', () => {
  const app = new Pico()
  app.all('/abc', () => 'Hi')

  it('Should return 200 response with GET request', async () => {
    const req = new Request('http://localhost/abc')
    const res = app.fetch(req)
    expect(res.status).toBe(200)
  })

  it('Should return 200 response with POST request', async () => {
    const req = new Request('http://localhost/abc', { method: 'POST' })
    const res = app.fetch(req)
    expect(res.status).toBe(200)
  })
})

describe('on', () => {
  const app = new Pico()
  app.on('PURGE', '/cache', () => 'purged')

  it('Should return 200 response with PURGE method', async () => {
    const req = new Request('http://localhost/cache', { method: 'PURGE' })
    const res = app.fetch(req)
    expect(res.status).toBe(200)
  })
})
