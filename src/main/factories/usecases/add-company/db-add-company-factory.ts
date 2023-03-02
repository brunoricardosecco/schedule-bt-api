import { DbAddCompany } from '@/data/usecases/add-company/db-add-company'
import { AddCompany } from '@/domain/usecases/add-company'
import { CompanyPostgresRepository } from '@/infra/db/postgres/company/company-prostgres-repository'

export const makeDbAddCompany = (): AddCompany => {
  const companyPostgresRepository = new CompanyPostgresRepository()

  return new DbAddCompany(companyPostgresRepository)
}
