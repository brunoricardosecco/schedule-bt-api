import { Router } from 'express'
import { routeAdapter } from '@/main/adapters/express/express-route-adapter'
import { makeAddCompanyController } from '@/main/factories/controllers/add-company/add-company-factory'
import { makeAuthenticateMiddleware } from '../factories/middlewares/authenticate-middleware/authenticate-middleware-factory'
import { expressMiddlewareAdapter } from '../adapters/express/express-middleware-adapter'

export default (router: Router): void => {
  router.post('/company', routeAdapter(makeAddCompanyController()))

  // Example for testing
  router.get('/company', expressMiddlewareAdapter(makeAuthenticateMiddleware()), (_, res) => res.send('Hello'))
}
