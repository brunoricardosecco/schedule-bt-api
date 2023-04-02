import { FindCompanyServiceHoursController } from '@/presentation/controllers/find-company-service-hours/find-company-service-hours-controller'
import { Controller } from '@/presentation/protocols'
import { makeLogControllerDecorator } from '../../decorators/log-controller-decorator-factory'
import { makeFindServiceHours } from '../../usecases/find-service-hours/find-service-hours-factory'

export const makeFindCompanyServiceHoursController = (): Controller => {
  const controller = new FindCompanyServiceHoursController(makeFindServiceHours())

  return makeLogControllerDecorator(controller)
}
