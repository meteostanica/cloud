import { Elysia } from 'elysia'

import mainRoutes from '../include/main'
import authRoutes from '../include/auth'
import panelRoutes from '../include/panel'

import lang from '../../lang/sk'

export default new Elysia()
  .use(mainRoutes("sk", lang))
  .use(authRoutes("sk", lang))
  .use(panelRoutes("sk", lang))