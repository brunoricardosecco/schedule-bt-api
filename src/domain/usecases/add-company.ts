import { Company } from '@/domain/models/company'

export type AddCompanyModel = {
  name: string
  reservationPrice: string
  reservationTimeInMinutes: number
}

export interface AddCompany {
  add: (company: AddCompanyModel) => Promise<Company>
}
