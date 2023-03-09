
import { Company } from '@/domain/models/company'
import { AddCompanyModel } from '@/domain/usecases/add-company'

export interface AddCompanyRepository {
  add: (companyData: AddCompanyModel) => Promise<Company>
}
