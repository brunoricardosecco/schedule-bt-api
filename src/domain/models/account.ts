import { Company } from './company'
import { Role } from './role'

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
