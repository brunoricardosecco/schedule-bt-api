import { AccountModel } from '@/domain/models/account'

export type AddAccountModel = {
  name: string
  email: string
  hashedPassword: string
}

export interface AddAccount {
  add: (account: AddAccountModel) => Promise<AccountModel>
}
