import { Pico } from '../src/pico'

describe('Test Pico', () => {
  const app = new Pico()
  app.get('/', () => 'Hi')
  it('Should return 200 response', async () => {
    const req = new Request('http://localhost')
    const res = app.fetch(req)
    expect(res.status).toBe(200)
    expect(await res.text()).toBe('Hi')
  })
})
