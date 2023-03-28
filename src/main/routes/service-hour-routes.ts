import { RoleEnum } from '@/domain/enums/role-enum'
import { Router } from 'express'
import { expressMiddlewareAdapter } from '../adapters/express/express-middleware-adapter'
import { routeAdapter } from '../adapters/express/express-route-adapter'
import { makeAddServiceHourController } from '../factories/controllers/add-service-hour/add-service-hour-factory'
import { makeAuthenticateMiddleware } from '../factories/middlewares/authenticate-middleware/authenticate-middleware-factory'
import { makeAuthorizeMiddleware } from '../factories/middlewares/authorize-middleware/authorize-middleware-factory'

export default (router: Router): void => {
  router.post(
    '/service-hour',
    expressMiddlewareAdapter(makeAuthenticateMiddleware()),
    expressMiddlewareAdapter(makeAuthorizeMiddleware([RoleEnum.COMPANY_ADMIN, RoleEnum.GENERAL_ADMIN])),
    routeAdapter(makeAddServiceHourController())
  )
}
