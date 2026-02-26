import { Elysia } from 'elysia'

import routes from './routes'

new Elysia()
  .use(routes)
  .get('/assets/*', async ({ params, status }) => {
    const file = Bun.file(`./assets/${params["*"]}`)
    if (!(await file.exists())) return status(404, "not found")

    return file;
  })
  .listen({ hostname: process.env.HOSTNAME, port: process.env.PORT })

console.log(`running on ${process.env.HOSTNAME}:${process.env.PORT}`)