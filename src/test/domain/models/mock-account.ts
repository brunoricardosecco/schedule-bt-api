import { RoleEnum } from '@/domain/enums/role-enum'
import { AccountModel } from '@/domain/models/account'
import { AddAccountModel } from '@/domain/usecases/add-account'
import { mockCompany } from './mock-company'

export const mockAccount = (accountValues?: Partial<AccountModel>): AccountModel => ({
  id: 'any_id',
  name: 'any_name',
  email: 'any_email@mail.com',
  hashedPassword: 'any_hashed_password',
  role: RoleEnum.EMPLOYEE,
  companyId: 'any_company_id',
  company: mockCompany(),
  emailValidationToken: null,
  emailValidationTokenExpiration: null,
  isConfirmed: false,
  createdAt: new Date('1970-01-01T00:00:00.000Z'),
  updatedAt: new Date('1970-01-01T00:00:00.000Z'),
  ...accountValues,
})

export const mockAccountData = (accountDataValues?: Partial<AddAccountModel>): AddAccountModel => ({
  name: 'any_name',
  email: 'any_email@mail.com',
  password: 'any_password',
  companyId: 'any_company_id',
  role: RoleEnum.EMPLOYEE,
  ...accountDataValues,
})
