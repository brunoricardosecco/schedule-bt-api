import { expressMiddlewareAdapter } from '@/main/adapters/express/express-middleware-adapter'
import { routeAdapter } from '@/main/adapters/express/express-route-adapter'
import { makeAuthenticateMiddleware } from '@/main/factories/middlewares/authenticate-middleware/authenticate-middleware-factory'
import { Router } from 'express'
import { updateAccountControllerFactory } from '../factories/controllers/update-account/update-account-controller-factory'

export default (router: Router): void => {
  router.patch(
    '/account',
    expressMiddlewareAdapter(makeAuthenticateMiddleware()),
    routeAdapter(updateAccountControllerFactory())
  )
}
