import { Router } from 'express'
import { routeAdapter } from '../adapters/express/express-route-adapter'
import { makeFindServiceHoursController } from '@/main/factories/controllers/find-service-hours/find-service-hours-factory'

export default (router: Router): void => {
  router.get(
    '/service-hour',
    routeAdapter(makeFindServiceHoursController())
  )
}
