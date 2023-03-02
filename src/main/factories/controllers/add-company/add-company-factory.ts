import { AddCompanyController } from '@/presentation/controllers/add-company/add-company-controller'
import { Controller } from '@/presentation/protocols'
import { makeLogControllerDecorator } from '@/main/factories/decorators/log-controller-decorator-factory'
import { makeDbAddCompany } from '@/main/factories/usecases/add-company/db-add-company-factory'
import { makeAddCompanyValidation } from './add-company-validation-factory'

export const makeAddCompanyController = (): Controller => {
  const controller = new AddCompanyController(makeDbAddCompany(), makeAddCompanyValidation())
  return makeLogControllerDecorator(controller)
}
