import { SignUpController } from '@/presentation/controllers/signup/signup-controller'
import { Controller } from '@/presentation/protocols'
import { makeLogControllerDecorator } from '@/main/factories/decorators/log-controller-decorator-factory'
import { makeDbAddAccount } from '@/main/factories/usecases/add-account/db-add-account-factory'
import { makeAuthenticationByPassword } from '@/main/factories/usecases/authentication-by-password/authentication-by-password-factory'
import { makeSignUpValidation } from './signup-validation-factory'

export const makeSignUpController = (): Controller => {
  const controller = new SignUpController(makeDbAddAccount(), makeSignUpValidation(), makeAuthenticationByPassword())
  return makeLogControllerDecorator(controller)
}
