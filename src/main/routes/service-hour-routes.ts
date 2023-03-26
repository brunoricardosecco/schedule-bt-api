import { RoleEnum } from '@/domain/enums/role-enum'
import { Router } from 'express'
import { expressMiddlewareAdapter } from '../adapters/express/express-middleware-adapter'
import { routeAdapter } from '../adapters/express/express-route-adapter'
import { makeAddServiceHourController } from '../factories/controllers/add-service-hour/add-service-hour-factory'
import { makeDeleteServiceHourController } from '../factories/controllers/delete-service-hour/delete-service-hour-factory'
import { makeFindServiceHoursController } from '../factories/controllers/find-service-hours/find-service-hours-factory'
import { makeAuthenticateMiddleware } from '../factories/middlewares/authenticate-middleware/authenticate-middleware-factory'
import { makeAuthorizeMiddleware } from '../factories/middlewares/authorize-middleware/authorize-middleware-factory'

export default (router: Router): void => {
  router.post('/service-hour', routeAdapter(makeAddServiceHourController()))
  router.get('/service-hour', routeAdapter(makeFindServiceHoursController()))
  router.delete('/service-hour/:serviceHourId',
    expressMiddlewareAdapter(makeAuthenticateMiddleware()),
    expressMiddlewareAdapter(makeAuthorizeMiddleware([RoleEnum.GENERAL_ADMIN, RoleEnum.COMPANY_ADMIN])),
    routeAdapter(makeDeleteServiceHourController())
  )
}
