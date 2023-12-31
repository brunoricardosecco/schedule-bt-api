import { Company } from '@/domain/models/company'

export type AddCompanyModel = {
  name: string
  reservationPrice: number
  reservationTimeInMinutes: number
}

export interface AddCompany {
  add: (company: AddCompanyModel) => Promise<Company>
}
