import { Role } from './../enums/roles'
import { Company } from './company'

export type AccountModel = {
  id: string
  name: string
  email: string
  hashedPassword: string | null
  companyId: string | null
  emailValidationToken: string | null
  emailValidationTokenExpiration: Date | null
  role: Role
  isConfirmed: boolean
  company: Company | null
  createdAt: Date
  updatedAt: Date
}
