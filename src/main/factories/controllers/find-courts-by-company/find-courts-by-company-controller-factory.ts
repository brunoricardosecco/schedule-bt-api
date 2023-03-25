import { findManyCourtsFactory } from '@/main/factories/usecases/find-courts/find-courts-factory'
import { Controller } from '@/presentation/protocols'
import { makeLogControllerDecorator } from '@/main/factories/decorators/log-controller-decorator-factory'
import { FindCourtsByCompanyController } from '@/presentation/controllers/find-courts-by-company/find-courts-by-company-controller'

export const findManyCourtsByCompanyControllerFactory = (): Controller => {
  const controller = new FindCourtsByCompanyController(findManyCourtsFactory())
  return makeLogControllerDecorator(controller)
}
