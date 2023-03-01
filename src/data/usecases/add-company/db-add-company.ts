import { Company, AddCompany, AddCompanyModel, AddCompanyRepository } from './db-add-company.protocols'

export class DbAddCompany implements AddCompany {
  constructor (
    private readonly dbAddCompanyRepository: AddCompanyRepository
  ) {}

  async add (companyData: AddCompanyModel): Promise<Company> {
    const company = await this.dbAddCompanyRepository.add(companyData)

    return company
  }
}
