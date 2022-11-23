import { Pico } from '../src/pico'

describe('Test Pico', () => {
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
