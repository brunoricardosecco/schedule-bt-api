import { updateAccountPasswordFactory } from '@/main/factories/usecases/update-account-password/update-account-password-factory'
import { Controller } from '@/presentation/protocols'
import { makeLogControllerDecorator } from '@/main/factories/decorators/log-controller-decorator-factory'
import { updateAccountPasswordValidation } from './update-account-password-validation-factory'
import { UpdateAccountPasswordController } from '@/presentation/controllers/update-account-password/update-account-password-controller'

export const updateAccountPasswordControllerFactory = (): Controller => {
  const controller = new UpdateAccountPasswordController(
    updateAccountPasswordFactory(),
    updateAccountPasswordValidation()
  )

  return makeLogControllerDecorator(controller)
}
