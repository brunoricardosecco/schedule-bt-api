import { routeAdapter } from '@/main/adapters/express/express-route-adapter'
import { makeAuthenticateByPasswordController } from '@/main/factories/controllers/authenticate-by-password/authenticate-by-password-controller-factory'
import { makeSignUpController } from '@/main/factories/controllers/signup/signup-controller-factory'
import { Router } from 'express'

export default (router: Router): void => {
  router.post('/signup', routeAdapter(makeSignUpController()))
  router.post('/authenticate-by-password', routeAdapter(makeAuthenticateByPasswordController()))
}
