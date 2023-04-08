import { makeLogControllerDecorator } from '@/main/factories/decorators/log-controller-decorator-factory'
import { createCourtsFactory } from '@/main/factories/usecases/create-courts/create-courts-factory'
import { CreateCourtsController } from '@/presentation/controllers/create-courts/create-courts-controller'
import { Controller } from '@/presentation/protocols'
import { createCourtsValidation } from './create-courts-validation-factory'

export const createCourtsControllerFactory = (): Controller => {
  const controller = new CreateCourtsController(createCourtsFactory(), createCourtsValidation())
  return makeLogControllerDecorator(controller)
}
