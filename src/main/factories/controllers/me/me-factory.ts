import { makeLogControllerDecorator } from '@/main/factories/decorators/log-controller-decorator-factory'
import { makeFindAccountByIdFactory } from '@/main/factories/usecases/find-account-by-id/find-account-by-id-factory'
import { MeController } from '@/presentation/controllers/me/me-controller'
import { Controller } from '@/presentation/protocols'

export const meControllerFactory = (): Controller => {
  const controller = new MeController(makeFindAccountByIdFactory())
  return makeLogControllerDecorator(controller)
}
