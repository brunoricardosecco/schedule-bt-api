import { makeLogControllerDecorator } from '@/main/factories/decorators/log-controller-decorator-factory'
import { deleteCourtByIdFactory } from '@/main/factories/usecases/delete-court-by-id.ts/delete-court-by-id-factory'
import { DeleteCourtByIdController } from '@/presentation/controllers/delete-court-by-id/delete-court-by-id-controller'
import { Controller } from '@/presentation/protocols'

export const deleteCourtByIdControllerFactory = (): Controller => {
  const controller = new DeleteCourtByIdController(deleteCourtByIdFactory())
  return makeLogControllerDecorator(controller)
}
