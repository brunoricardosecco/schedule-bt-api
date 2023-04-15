import { AddCompanyRepository } from '@/data/protocols/db/company/add-company-repository'
import {
  FindCompaniesRepository,
  FindCompaniesRepositoryParams,
} from '@/data/protocols/db/company/find-company-repository'
import { Company } from '@/domain/models/company'
import { AddCompanyModel } from '@/domain/usecases/add-company'
import { db } from '@/infra/db/orm/prisma'

export class CompanyPostgresRepository implements AddCompanyRepository, FindCompaniesRepository {
  async add(companyData: AddCompanyModel): Promise<Company> {
    const company = await db.companies.create({
      data: companyData,
    })

    return company
  }

  async findBy(params: FindCompaniesRepositoryParams): Promise<Company[]> {
    return await db.companies.findMany({
      where: {
        id: params.companyId,
      },
    })
  }
}
