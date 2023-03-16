import { Router } from 'express'
import { routeAdapter } from '@/main/adapters/express/express-route-adapter'
import { makeAddCompanyController } from '@/main/factories/controllers/add-company/add-company-factory'
import { makeAuthenticateMiddleware } from '../factories/middlewares/authenticate-middleware/authenticate-middleware-factory'
import { expressMiddlewareAdapter } from '../adapters/express/express-middleware-adapter'
import { makeAuthorizeMiddleware } from '../factories/middlewares/authorize-middleware/authorize-middleware-factory'
import { RoleEnum } from '@/domain/enums/role-enum'

export default (router: Router): void => {
  router.post('/company', routeAdapter(makeAddCompanyController()))

  // Example for testing
  router.get(
    '/company',
    expressMiddlewareAdapter(makeAuthenticateMiddleware()),
    expressMiddlewareAdapter(makeAuthorizeMiddleware([RoleEnum.COMPANY_ADMIN])),
    (_, res) => res.send('Hello')
  )
}
