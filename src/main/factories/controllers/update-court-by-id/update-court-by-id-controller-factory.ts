import { makeLogControllerDecorator } from '@/main/factories/decorators/log-controller-decorator-factory'
import { updateCourtByIdFactory } from '@/main/factories/usecases/update-court-by-id.ts/update-court-by-id-factory'
import { UpdateCourtByIdController } from '@/presentation/controllers/update-court-by-id/update-court-by-id-controller'
import { Controller } from '@/presentation/protocols'
import { makeUpdateCourtByIdValidation } from './update-court-by-id-validation-factory'

export const updateCourtByIdControllerFactory = (): Controller => {
  const controller = new UpdateCourtByIdController(updateCourtByIdFactory(), makeUpdateCourtByIdValidation())
  return makeLogControllerDecorator(controller)
}
