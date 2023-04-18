import { Company } from '@/domain/models/company'
import { AddCompany } from '@/domain/usecases/add-company'
import { mockCompany } from '../models/mock-company'

export const mockAddCompany = (): AddCompany => {
  class AddCompanyStub implements AddCompany {
    async add(): Promise<Company> {
      return await Promise.resolve(mockCompany())
    }
  }

  return new AddCompanyStub()
}
