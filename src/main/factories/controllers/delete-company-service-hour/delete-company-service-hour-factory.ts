import { DeleteCompanyServiceHourController } from '@/presentation/controllers/delete-company-service-hour/delete-company-service-hour-controller'
import { Controller } from '@/presentation/protocols'
import { makeLogControllerDecorator } from '../../decorators/log-controller-decorator-factory'
import { makeDeleteServiceHour } from '../../usecases/delete-service-hour/delete-service-hour-factory'

export const makeDeleteCompanyServiceHourController = (): Controller => {
  const controller = new DeleteCompanyServiceHourController(makeDeleteServiceHour())

  return makeLogControllerDecorator(controller)
}
