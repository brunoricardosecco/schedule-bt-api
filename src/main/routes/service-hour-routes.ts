import { RoleEnum } from '@/domain/enums/role-enum'
import { Router } from 'express'
import { expressMiddlewareAdapter } from '../adapters/express/express-middleware-adapter'
import { routeAdapter } from '../adapters/express/express-route-adapter'
import { makeAddServiceHourController } from '../factories/controllers/add-service-hour/add-service-hour-factory'
import { makeFindServiceHoursController } from '@/main/factories/controllers/find-service-hours/find-service-hours-factory'
import { makeAuthenticateMiddleware } from '../factories/middlewares/authenticate-middleware/authenticate-middleware-factory'
import { makeAuthorizeMiddleware } from '../factories/middlewares/authorize-middleware/authorize-middleware-factory'

export default (router: Router): void => {
  router.post(
    '/service-hour',
    expressMiddlewareAdapter(makeAuthenticateMiddleware()),
    expressMiddlewareAdapter(makeAuthorizeMiddleware([RoleEnum.COMPANY_ADMIN])),
    routeAdapter(makeAddServiceHourController())
  )
  router.get(
    '/service-hour',
    expressMiddlewareAdapter(makeAuthenticateMiddleware()), // TODO: Posteriormente com a adição do app do cliente, a autenticação não será mais necessária
    expressMiddlewareAdapter(makeAuthorizeMiddleware([RoleEnum.CLIENT, RoleEnum.EMPLOYEE, RoleEnum.COMPANY_ADMIN])),
    routeAdapter(makeFindServiceHoursController())
  )
}
