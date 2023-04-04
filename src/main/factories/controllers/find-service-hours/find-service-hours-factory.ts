import { FindServiceHoursController } from '@/presentation/controllers/find-service-hours/find-service-hours-controller'
import { Controller } from '@/presentation/protocols'
import { makeLogControllerDecorator } from '../../decorators/log-controller-decorator-factory'
import { makeFindServiceHours } from '../../usecases/find-service-hours/find-service-hours-factory'

export const makeFindServiceHoursController = (): Controller => {
  const controller = new FindServiceHoursController(makeFindServiceHours())

  return makeLogControllerDecorator(controller)
}
