import { Router } from 'express'
import { routeAdapter } from '@/main/adapters/express/express-route-adapter'
import { makeAddCompanyController } from '@/main/factories/controllers/add-company/add-company-factory'
import { makeAuthenticateMiddleware } from '@/main/factories/middlewares/authenticate-middleware/authenticate-middleware-factory'
import { expressMiddlewareAdapter } from '@/main/adapters/express/express-middleware-adapter'
import { makeAuthorizeMiddleware } from '@/main/factories/middlewares/authorize-middleware/authorize-middleware-factory'
import { RoleEnum } from '@/domain/enums/role-enum'
import { findManyCourtsByCompanyControllerFactory } from '@/main/factories/controllers/find-courts-by-company/find-courts-by-company-controller-factory'
import { makeAddServiceHourController } from '@/main/factories/controllers/add-service-hour/add-service-hour-factory'
import { makeFindCompanyServiceHoursController } from '../factories/controllers/find-company-service-hours/find-company-service-hours-factory'
import { makeDeleteServiceHourController } from '../factories/controllers/delete-service-hour/delete-service-hour-factory'

export default (router: Router): void => {
  router.post(
    '/company',
    expressMiddlewareAdapter(makeAuthenticateMiddleware()),
    expressMiddlewareAdapter(makeAuthorizeMiddleware([RoleEnum.GENERAL_ADMIN])),
    routeAdapter(makeAddCompanyController())
  )

  router.get(
    '/company/court',
    expressMiddlewareAdapter(makeAuthenticateMiddleware()),
    expressMiddlewareAdapter(makeAuthorizeMiddleware([RoleEnum.COMPANY_ADMIN, RoleEnum.EMPLOYEE])),
    routeAdapter(findManyCourtsByCompanyControllerFactory())
  )

  router.post(
    '/company/service-hour',
    expressMiddlewareAdapter(makeAuthenticateMiddleware()),
    expressMiddlewareAdapter(makeAuthorizeMiddleware([RoleEnum.COMPANY_ADMIN])),
    routeAdapter(makeAddServiceHourController())
  )

  router.get(
    '/company/service-hour',
    expressMiddlewareAdapter(makeAuthenticateMiddleware()),
    expressMiddlewareAdapter(makeAuthorizeMiddleware([RoleEnum.EMPLOYEE, RoleEnum.COMPANY_ADMIN])),
    routeAdapter(makeFindCompanyServiceHoursController())
  )

  router.delete(
    '/company/service-hour/:serviceHourId',
    expressMiddlewareAdapter(makeAuthenticateMiddleware()),
    expressMiddlewareAdapter(makeAuthorizeMiddleware([RoleEnum.GENERAL_ADMIN, RoleEnum.COMPANY_ADMIN])),
    routeAdapter(makeDeleteServiceHourController())
  )
}
