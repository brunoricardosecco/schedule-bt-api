import { makeFindServiceHoursController } from '@/main/factories/controllers/find-service-hours/find-service-hours-factory'
import { Router } from 'express'
import { routeAdapter } from '../adapters/express/express-route-adapter'

export default (router: Router): void => {
  router.get('/service-hour', routeAdapter(makeFindServiceHoursController()))
}
