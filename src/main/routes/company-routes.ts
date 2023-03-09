import { Router } from 'express'
import { routeAdapter } from '@/main/adapters/express/express-route-adapter'
import { makeAddCompanyController } from '@/main/factories/controllers/add-company/add-company-factory'

export default (router: Router): void => {
  router.post('/company', routeAdapter(makeAddCompanyController()))
}
