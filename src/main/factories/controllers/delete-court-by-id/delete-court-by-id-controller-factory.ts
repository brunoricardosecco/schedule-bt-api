import { makeLogControllerDecorator } from '@/main/factories/decorators/log-controller-decorator-factory'
import { DeleteCourtByIdController } from '@/presentation/controllers/delete-court-by-id/delete-court-by-id-controller'
import { Controller } from '@/presentation/protocols'
import { deleteCourtByIdFactory } from '../../usecases/delete-court-by-id.ts/delete-court-by-id-factory'
import { findCourtByIdAndCompanyIdFactory } from '../../usecases/find-court-by-id-and-company-id/find-court-by-id-and-company-id-factory'

export const deleteCourtByIdControllerFactory = (): Controller => {
  const controller = new DeleteCourtByIdController(deleteCourtByIdFactory(), findCourtByIdAndCompanyIdFactory())
  return makeLogControllerDecorator(controller)
}
