import { Role } from '@/domain/models/role'

import { AccountModel } from '@/domain/models/account'

export type AddAccountToRepository = {
  name: string
  email: string
  hashedPassword: string
  companyId: string
  role: Role
}

export interface AddAccountRepository {
  add: (accountData: AddAccountToRepository) => Promise<AccountModel>
}
