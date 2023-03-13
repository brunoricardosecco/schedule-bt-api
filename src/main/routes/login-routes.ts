import { Router } from 'express'
import { routeAdapter } from '@/main/adapters/express/express-route-adapter'
import { makeSignUpController } from '@/main/factories/controllers/signup/signup-controller-factory'
import { makeAuthenticateByPasswordController } from '@/main/factories/controllers/authenticate-by-password/authenticate-by-password-controller-factory'

export default (router: Router): void => {
  router.post('/signup', routeAdapter(makeSignUpController()))
  router.post('/authenticate-by-password', routeAdapter(makeAuthenticateByPasswordController()))
}
