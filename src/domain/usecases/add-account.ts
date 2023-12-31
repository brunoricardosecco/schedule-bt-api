import { AccountModel } from '@/domain/models/account'
import { Role } from '@/domain/models/role'

export type AddAccountModel = {
  name: string
  email: string
  password: string
  companyId: string
  role: Role
}

export interface AddAccount {
  add: (account: AddAccountModel) => Promise<AccountModel | Error>
}
