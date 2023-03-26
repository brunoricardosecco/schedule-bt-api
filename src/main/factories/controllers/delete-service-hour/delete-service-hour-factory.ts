import { DeleteServiceHourController } from '@/presentation/controllers/delete-service-hour/delete-service-hour-controller'
import { Controller } from '@/presentation/protocols'
import { makeLogControllerDecorator } from '../../decorators/log-controller-decorator-factory'
import { makeDeleteServiceHour } from '../../usecases/delete-service-hour/delete-service-hour-factory'

export const makeDeleteServiceHourController = (): Controller => {
  const controller = new DeleteServiceHourController(makeDeleteServiceHour())

  return makeLogControllerDecorator(controller)
}
