import { Elysia } from 'elysia'

import enRoutes from './lang/en'
import skRoutes from './lang/sk'
import websocket from './include/websocket'

export default new Elysia()
  .use(skRoutes)
  .use(enRoutes)
  .use(websocket)