import { makeLogControllerDecorator } from '@/main/factories/decorators/log-controller-decorator-factory'
import { makeFindReservationSlots } from '@/main/factories/usecases/find-reservation-slots/find-reservation-slots-factory'
import { FindCompanyReservationSlotsController } from '@/presentation/controllers/find-company-reservation-slots/find-company-reservation-slots-controller'
import { Controller } from '@/presentation/protocols'
import { findCompanyReservationSlotsValidation } from './find-company-reservation-slots-validation'

export const makeCompanyReservationSlotsController = (): Controller => {
  const controller = new FindCompanyReservationSlotsController(
    findCompanyReservationSlotsValidation(),
    makeFindReservationSlots()
  )

  return makeLogControllerDecorator(controller)
}
