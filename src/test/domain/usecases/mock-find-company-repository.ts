import {
  FindCompaniesRepository,
  FindCompaniesRepositoryParams,
} from '@/data/usecases/find-reservation-slots/find-reservation-slots.protocols'
import { Company } from '@/domain/models/company'
import { mockCompany } from '../models/mock-company'

export const mockFindCompaniesRepository = (): FindCompaniesRepository => {
  class FindCompaniesRepositoryStub implements FindCompaniesRepository {
    async findBy(params: FindCompaniesRepositoryParams): Promise<Company[]> {
      return await Promise.resolve([mockCompany()])
    }
  }

  return new FindCompaniesRepositoryStub()
}
