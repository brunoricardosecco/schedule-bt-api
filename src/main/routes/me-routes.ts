import { expressMiddlewareAdapter } from '@/main/adapters/express/express-middleware-adapter'
import { routeAdapter } from '@/main/adapters/express/express-route-adapter'
import { meControllerFactory } from '@/main/factories/controllers/me/me-factory'
import { makeAuthenticateMiddleware } from '@/main/factories/middlewares/authenticate-middleware/authenticate-middleware-factory'
import { Router } from 'express'

export default (router: Router): void => {
  router.get('/me', expressMiddlewareAdapter(makeAuthenticateMiddleware()), routeAdapter(meControllerFactory()))
}
