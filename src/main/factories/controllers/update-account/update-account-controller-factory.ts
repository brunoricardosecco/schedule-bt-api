import { updateAccountFactory } from '@/main/factories/usecases/update-account/update-account-factory'
import { Controller } from '@/presentation/protocols'
import { makeLogControllerDecorator } from '@/main/factories/decorators/log-controller-decorator-factory'
import { UpdateAccountController } from '@/presentation/controllers/update-account/update-account-controller'

export const updateAccountControllerFactory = (): Controller => {
  const controller = new UpdateAccountController(
    updateAccountFactory()
  )

  return makeLogControllerDecorator(controller)
}
