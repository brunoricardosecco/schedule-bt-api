
import { AccountModel } from '@/domain/models/account'

export type AddAccountToRepository = {
  name: string
  email: string
  hashedPassword: string
}

export interface AddAccountRepository {
  add: (accountData: AddAccountToRepository) => Promise<AccountModel>
}
