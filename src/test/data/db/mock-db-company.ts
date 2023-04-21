import { AddCompanyModel, AddCompanyRepository, Company } from '@/data/usecases/add-company/db-add-company.protocols'
import { mockCompany } from '@/test/domain/models/mock-company'

export const mockAddCompanyRepository = (): AddCompanyRepository => {
  class AddCompanyRepositoryStub implements AddCompanyRepository {
    async add(accountData: AddCompanyModel): Promise<Company> {
      return await Promise.resolve(mockCompany())
    }
  }

  return new AddCompanyRepositoryStub()
}
