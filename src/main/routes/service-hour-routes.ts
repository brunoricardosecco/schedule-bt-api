import { Router } from 'express'
import { routeAdapter } from '../adapters/express/express-route-adapter'
import { makeAddServiceHourController } from '../factories/controllers/add-service-hour/add-service-hour-factory'

export default (router: Router): void => {
  router.post('/service-hour', routeAdapter(makeAddServiceHourController()))
}
