import { FindCompanyReservationIntervalsController } from '@/presentation/controllers/find-company-reservation-intervals/find-company-reservation-intervals-controller'
import { Controller } from '@/presentation/protocols'
import { makeLogControllerDecorator } from '@/main/factories/decorators/log-controller-decorator-factory'
import { findCompanyReservationIntervalsValidation } from './find-company-reservation-intervals-validation'
import { makeFindReservationIntervals } from '@/main/factories/usecases/find-reservation-intervals/find-reservation-intervals-factory'

export const makeCompanyReservationIntervalsController = (): Controller => {
  const controller = new FindCompanyReservationIntervalsController(findCompanyReservationIntervalsValidation(), makeFindReservationIntervals())

  return makeLogControllerDecorator(controller)
}
