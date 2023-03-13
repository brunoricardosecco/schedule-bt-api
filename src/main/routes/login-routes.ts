import { Router } from 'express'
import { routeAdapter } from '@/main/adapters/express/express-route-adapter'
import { makeSignUpController } from '@/main/factories/controllers/signup/signup-controller-factory'
import { makeAuthenticationByPasswordController } from '@/main/factories/controllers/authentication-by-password/authentication-by-password-controller-factory'

export default (router: Router): void => {
  router.post('/signup', routeAdapter(makeSignUpController()))
  router.post('/login', routeAdapter(makeAuthenticationByPasswordController()))
}
