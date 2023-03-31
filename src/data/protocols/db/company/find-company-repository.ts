import { Company } from '@/domain/models/company'

export type FindCompaniesRepositoryParams = {
  companyId?: string
}

export interface FindCompaniesRepository {
  findBy: (params: FindCompaniesRepositoryParams) => Promise<Company[]>
}
