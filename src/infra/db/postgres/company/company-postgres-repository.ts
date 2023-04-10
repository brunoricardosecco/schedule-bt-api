import { AddCompanyRepository } from '@/data/protocols/db/company/add-company-repository'
import { Company } from '@/domain/models/company'
import { AddCompanyModel } from '@/domain/usecases/add-company'
import { db } from '@/infra/db/orm/prisma'

export class CompanyPostgresRepository implements AddCompanyRepository {
  async add(companyData: AddCompanyModel): Promise<Company> {
    const company = await db.companies.create({
      data: companyData,
    })

    return company
  }
}
