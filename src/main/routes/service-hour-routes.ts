import { Router } from 'express'
import { routeAdapter } from '../adapters/express/express-route-adapter'
import { makeAddServiceHourController } from '../factories/controllers/add-service-hour/add-service-hour-factory'
import { makeFindServiceHoursController } from '../factories/controllers/find-service-hours/find-service-hours-factory'

export default (router: Router): void => {
  router.post('/service-hour', routeAdapter(makeAddServiceHourController()))
  router.get('/service-hour', routeAdapter(makeFindServiceHoursController()))
}
