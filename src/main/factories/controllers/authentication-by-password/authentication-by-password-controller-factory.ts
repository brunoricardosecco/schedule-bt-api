import { AuthenticationByPasswordController } from '@/presentation/controllers/authentication-by-password/authentication-by-password-controller'
import { Controller } from '@/presentation/protocols'
import { makeLogControllerDecorator } from '@/main/factories/decorators/log-controller-decorator-factory'
import { makeAuthenticationByPassword } from '@/main/factories/usecases/authentication-by-password/authentication-by-password-factory'
import { makeAuthenticationByPasswordValidation } from './authentication-by-password-validation-factory'

export const makeAuthenticationByPasswordController = (): Controller => {
  const controller = new AuthenticationByPasswordController(makeAuthenticationByPassword(), makeAuthenticationByPasswordValidation())
  return makeLogControllerDecorator(controller)
}
