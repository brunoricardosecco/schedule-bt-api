import { Router } from 'express'
import { routeAdapter } from '@/main/adapters/express/express-route-adapter'
import { makeAddCompanyController } from '@/main/factories/controllers/add-company/add-company-factory'
import { makeAuthenticateMiddleware } from '@/main/factories/middlewares/authenticate-middleware/authenticate-middleware-factory'
import { expressMiddlewareAdapter } from '@/main/adapters/express/express-middleware-adapter'
import { makeAuthorizeMiddleware } from '@/main/factories/middlewares/authorize-middleware/authorize-middleware-factory'
import { RoleEnum } from '@/domain/enums/role-enum'

import { findManyCourtsByCompanyControllerFactory } from '@/main/factories/controllers/find-many-courts-by-company/find-many-courts-by-company-controller-factory'

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
}
