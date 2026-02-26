import { Elysia } from 'elysia'

import enRoutes from './lang/en'
import skRoutes from './lang/sk'

export default new Elysia()
  .use(skRoutes)
  .use(enRoutes)