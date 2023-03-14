import { makeAuthenticate } from './../factories/usecases/authenticate/authenticate-factory'
import { Router } from 'express'
import { routeAdapter } from '@/main/adapters/express/express-route-adapter'
import { makeAddCompanyController } from '@/main/factories/controllers/add-company/add-company-factory'
import { expressMiddlewareAdapter } from '../adapters/express/express-middleware-adapter'
import { AuthMiddleware } from '@/presentation/middlewares/auth-middleware'

const authMiddleware = expressMiddlewareAdapter(new AuthMiddleware(makeAuthenticate()))

export default (router: Router): void => {
  router.post('/company', routeAdapter(makeAddCompanyController()))

  // Example for testing
  router.get('/company', authMiddleware, (_, res) => res.send('Hello'))
}
