import { Elysia } from 'elysia'

import routes from './routes'

new Elysia()
  .use(routes)
  .get('/assets/*', async ({ params, status }) => {
    const file = Bun.file(`./assets/${params["*"]}`)
    if (!(await file.exists())) return status(404, "not found")

    return file;
  })
  .listen({ hostname: "127.0.0.1", port: 3000 })

console.log(`running on port 3000`)