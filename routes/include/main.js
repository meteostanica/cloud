import { Elysia } from 'elysia'

import { Eta } from "eta"
const eta = new Eta({ views: "./templates" })

export default (langName) => new Elysia()
  .get('/', ({ set }) => {
    set.headers['content-type'] = 'text/html; charset=utf8'
    return eta.render(`${langName}/index`)
  })