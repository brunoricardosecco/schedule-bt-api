import { AccountModel } from '../models/account'

export type AccountModelWithoutPassword = Omit<AccountModel, 'hashedPassword'>

export interface IFindAccountById {
  findById: (accountId: string) => Promise<AccountModelWithoutPassword>
}
