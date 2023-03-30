import { RoleEnum } from '@/domain/enums/role-enum'
import { expressMiddlewareAdapter } from '@/main/adapters/express/express-middleware-adapter'
import { routeAdapter } from '@/main/adapters/express/express-route-adapter'
import { createCourtsControllerFactory } from '@/main/factories/controllers/create-courts/create-courts-controller-factory'
import { makeAuthenticateMiddleware } from '@/main/factories/middlewares/authenticate-middleware/authenticate-middleware-factory'
import { makeAuthorizeMiddleware } from '@/main/factories/middlewares/authorize-middleware/authorize-middleware-factory'
import { Router } from 'express'
import { deleteCourtByIdControllerFactory } from '../factories/controllers/delete-court-by-id/delete-court-by-id-controller-factory'

export default (router: Router): void => {
  router.post(
    '/court/bulk',
    expressMiddlewareAdapter(makeAuthenticateMiddleware()),
    expressMiddlewareAdapter(makeAuthorizeMiddleware([RoleEnum.COMPANY_ADMIN])),
    routeAdapter(createCourtsControllerFactory())
  )

  router.delete(
    '/court/:courtId',
    expressMiddlewareAdapter(makeAuthenticateMiddleware()),
    expressMiddlewareAdapter(makeAuthorizeMiddleware([RoleEnum.COMPANY_ADMIN])),
    routeAdapter(deleteCourtByIdControllerFactory())
  )
}
