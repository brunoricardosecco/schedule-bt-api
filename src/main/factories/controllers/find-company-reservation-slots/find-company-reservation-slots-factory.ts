import { FindCompanyReservationSlotsController } from '@/presentation/controllers/find-company-reservation-slots/find-company-reservation-slots-controller'
import { Controller } from '@/presentation/protocols'
import { makeLogControllerDecorator } from '@/main/factories/decorators/log-controller-decorator-factory'
import { findCompanyReservationSlotsValidation } from './find-company-reservation-slots-validation'
import { makeFindReservationSlots } from '@/main/factories/usecases/find-reservation-slots/find-reservation-slots-factory'

export const makeCompanyReservationSlotsController = (): Controller => {
  const controller = new FindCompanyReservationSlotsController(findCompanyReservationSlotsValidation(), makeFindReservationSlots())

  return makeLogControllerDecorator(controller)
}
