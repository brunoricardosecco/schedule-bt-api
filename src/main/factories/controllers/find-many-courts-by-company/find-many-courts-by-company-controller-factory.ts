import { findManyCourtsFactory } from '@/main/factories/usecases/find-many-courts/find-many-courts-factory'
import { Controller } from '@/presentation/protocols'
import { makeLogControllerDecorator } from '@/main/factories/decorators/log-controller-decorator-factory'
import { FindManyCourtsByCompanyController } from '@/presentation/controllers/find-many-courts-by-company/find-many-courts-by-company-controller'

export const findManyCourtsByCompanyControllerFactory = (): Controller => {
  const controller = new FindManyCourtsByCompanyController(findManyCourtsFactory())
  return makeLogControllerDecorator(controller)
}
