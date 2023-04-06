import { FindReservationIntervalsController } from '@/presentation/controllers/find-reservation-intervals/find-reservation-intervals-controller'
import { Controller } from '@/presentation/protocols'
import { makeLogControllerDecorator } from '@/main/factories/decorators/log-controller-decorator-factory'
import { createReservationIntervalsValidation } from './find-reservation-intervals-validation'
import { makeFindReservationIntervals } from '@/main/factories/usecases/find-reservation-intervals/find-reservation-intervals-factory'

export const makeReservationIntervalsController = (): Controller => {
  const controller = new FindReservationIntervalsController(createReservationIntervalsValidation(), makeFindReservationIntervals())

  return makeLogControllerDecorator(controller)
}
