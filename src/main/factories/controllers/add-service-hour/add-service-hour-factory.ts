import { makeAddServiceHour } from '@/main/factories/usecases/add-service-hour/db-add-service-hour-factory'
import { AddServiceHourController } from '@/presentation/controllers/add-service-hour/add-service-hour-controller'
import { Controller } from '@/presentation/protocols'
import { makeLogControllerDecorator } from '../../decorators/log-controller-decorator-factory'
import { makeAddServiceHourValidation } from './add-service-hour-validation-factory'

export const makeAddServiceHourController = (): Controller => {
  const controller = new AddServiceHourController(makeAddServiceHour(), makeAddServiceHourValidation())

  return makeLogControllerDecorator(controller)
}
