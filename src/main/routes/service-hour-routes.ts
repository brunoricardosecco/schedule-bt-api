import { RoleEnum } from '@/domain/enums/role-enum'
import { Router } from 'express'
import { expressMiddlewareAdapter } from '@/main/adapters/express/express-middleware-adapter'
import { routeAdapter } from '@/main/adapters/express/express-route-adapter'
import { makeAddServiceHourController } from '@/main/factories/controllers/add-service-hour/add-service-hour-factory'
import { makeFindServiceHoursController } from '@/main/factories/controllers/find-service-hours/find-service-hours-factory'
import { makeAuthenticateMiddleware } from '@/main/factories/middlewares/authenticate-middleware/authenticate-middleware-factory'
import { makeAuthorizeMiddleware } from '@/main/factories/middlewares/authorize-middleware/authorize-middleware-factory'

export default (router: Router): void => {
  router.post('/service-hour', routeAdapter(makeAddServiceHourController()))
  router.get(
    '/service-hour',
    expressMiddlewareAdapter(makeAuthenticateMiddleware()), // TODO: Posteriormente com a adição do app do cliente, a autenticação não será mais necessária
    expressMiddlewareAdapter(makeAuthorizeMiddleware([RoleEnum.CLIENT, RoleEnum.EMPLOYEE, RoleEnum.COMPANY_ADMIN, RoleEnum.GENERAL_ADMIN])),
    routeAdapter(makeFindServiceHoursController())
  )
}
