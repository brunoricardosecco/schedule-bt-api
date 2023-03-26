import { createCourtsFactory } from '@/main/factories/usecases/create-courts/create-courts-factory'
import { Controller } from '@/presentation/protocols'
import { makeLogControllerDecorator } from '@/main/factories/decorators/log-controller-decorator-factory'
import { createCourtsValidation } from './create-courts-validation-factory'
import { CreateCourtsController } from '@/presentation/controllers/create-courts/create-courts-controller'

export const createCourtsControllerFactory = (): Controller => {
  const controller = new CreateCourtsController(createCourtsFactory(), createCourtsValidation())
  return makeLogControllerDecorator(controller)
}
