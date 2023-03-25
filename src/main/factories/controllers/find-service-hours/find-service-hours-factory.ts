import { FindServiceHoursController } from '@/presentation/controllers/find-service-hours/find-service-hours-controller'
import { Controller } from '@/presentation/protocols'
import { makeLogControllerDecorator } from '../../decorators/log-controller-decorator-factory'
import { makeDbFindServiceHours } from '../../usecases/find-service-hours/db-find-service-hours-factory'

export const makeFindServiceHoursController = (): Controller => {
  const controller = new FindServiceHoursController(makeDbFindServiceHours())

  return makeLogControllerDecorator(controller)
}
