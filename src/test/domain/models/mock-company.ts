import { Company } from '@/domain/models/company'
import { AddCompanyModel } from '@/domain/usecases/add-company'

export const mockCompany = (companyValues?: Partial<Company>): Company => ({
  id: 'any_id',
  name: 'any_name',
  reservationPrice: 60,
  reservationTimeInMinutes: 60,
  createdAt: new Date('1970-01-01T00:00:00.000Z'),
  updatedAt: new Date('1970-01-01T00:00:00.000Z'),
  ...companyValues,
})

export const mockCompanyData = (companyDataValues?: Partial<AddCompanyModel>): AddCompanyModel => ({
  name: 'any_name',
  reservationPrice: 60,
  reservationTimeInMinutes: 60,
  ...companyDataValues,
})
