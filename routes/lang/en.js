import { Elysia } from 'elysia'

import mainRoutes from '../include/main'
import authRoutes from '../include/auth'
import panelRoutes from '../include/panel'
import websocketRoutes from '../include/websocket'

import lang from '../../lang/en'

export default new Elysia({ prefix: "/en" })
  .use(mainRoutes("en"))
  .use(authRoutes("en", lang))
  .use(panelRoutes("en", lang))
  .use(websocketRoutes("en", lang))