import { Router } from 'express'
import { routeAdapter } from '@/main/adapters/express/express-route-adapter'
import { createCourtsControllerFactory } from '@/main/factories/controllers/create-courts/create-courts-controller-factory'
import { makeAuthenticateMiddleware } from '@/main/factories/middlewares/authenticate-middleware/authenticate-middleware-factory'
import { expressMiddlewareAdapter } from '@/main/adapters/express/express-middleware-adapter'
import { makeAuthorizeMiddleware } from '@/main/factories/middlewares/authorize-middleware/authorize-middleware-factory'
import { RoleEnum } from '@/domain/enums/role-enum'

export default (router: Router): void => {
  router.post(
    '/court/bulk',
    expressMiddlewareAdapter(makeAuthenticateMiddleware()),
    expressMiddlewareAdapter(makeAuthorizeMiddleware([RoleEnum.COMPANY_ADMIN])),
    routeAdapter(createCourtsControllerFactory())
  )
}
