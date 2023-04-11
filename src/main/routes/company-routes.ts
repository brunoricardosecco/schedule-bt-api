import { RoleEnum } from '@/domain/enums/role-enum'
import { expressMiddlewareAdapter } from '@/main/adapters/express/express-middleware-adapter'
import { routeAdapter } from '@/main/adapters/express/express-route-adapter'
import { makeAddCompanyController } from '@/main/factories/controllers/add-company/add-company-factory'
import { makeAddServiceHourController } from '@/main/factories/controllers/add-service-hour/add-service-hour-factory'
import { deleteCourtByIdControllerFactory } from '@/main/factories/controllers/delete-court-by-id/delete-court-by-id-controller-factory'
import { makeFindCompanyServiceHoursController } from '@/main/factories/controllers/find-company-service-hours/find-company-service-hours-factory'
import { findManyCourtsByCompanyControllerFactory } from '@/main/factories/controllers/find-courts-by-company/find-courts-by-company-controller-factory'
import { updateCourtByIdControllerFactory } from '@/main/factories/controllers/update-court-by-id/update-court-by-id-controller-factory'
import { makeAuthenticateMiddleware } from '@/main/factories/middlewares/authenticate-middleware/authenticate-middleware-factory'
import { makeAuthorizeMiddleware } from '@/main/factories/middlewares/authorize-middleware/authorize-middleware-factory'
import { Router } from 'express'
import { makeDeleteCompanyServiceHourController } from '../factories/controllers/delete-company-service-hour/delete-company-service-hour-factory'
import { makeCompanyReservationSlotsController } from '../factories/controllers/find-company-reservation-slots/find-company-reservation-slots-factory'

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

  router.patch(
    '/company/court/:courtId',
    expressMiddlewareAdapter(makeAuthenticateMiddleware()),
    expressMiddlewareAdapter(makeAuthorizeMiddleware([RoleEnum.COMPANY_ADMIN, RoleEnum.EMPLOYEE])),
    routeAdapter(updateCourtByIdControllerFactory())
  )

  router.delete(
    '/company/court/:courtId',
    expressMiddlewareAdapter(makeAuthenticateMiddleware()),
    expressMiddlewareAdapter(makeAuthorizeMiddleware([RoleEnum.COMPANY_ADMIN])),
    routeAdapter(deleteCourtByIdControllerFactory())
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
    expressMiddlewareAdapter(makeAuthorizeMiddleware([RoleEnum.COMPANY_ADMIN])),
    routeAdapter(makeDeleteCompanyServiceHourController())
  )

  router.get(
    '/company/reservation-slots',
    expressMiddlewareAdapter(makeAuthenticateMiddleware()),
    expressMiddlewareAdapter(makeAuthorizeMiddleware([RoleEnum.COMPANY_ADMIN, RoleEnum.EMPLOYEE])),
    routeAdapter(makeCompanyReservationSlotsController())
  )
}
