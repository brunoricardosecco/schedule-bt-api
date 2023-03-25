import { AuthenticateByPasswordController } from '@/presentation/controllers/authenticate-by-password/authenticate-by-password-controller'
import { Controller } from '@/presentation/protocols'
import { makeLogControllerDecorator } from '@/main/factories/decorators/log-controller-decorator-factory'
import { makeAuthenticateByPassword } from '@/main/factories/usecases/authenticate-by-password/authenticate-by-password-factory'
import { makeAuthenticateByPasswordValidation } from './authenticate-by-password-validation-factory'

export const makeAuthenticateByPasswordController = (): Controller => {
  const controller = new AuthenticateByPasswordController(makeAuthenticateByPassword(), makeAuthenticateByPasswordValidation())
  return makeLogControllerDecorator(controller)
}
