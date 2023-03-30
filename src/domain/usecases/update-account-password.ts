import { AccountModel } from '@/domain/models/account'

export type UpdateAccountPasswordReturn = Promise<AccountModel | Error>

export interface IUpdateAccountPassword {
  update: (password: string) => UpdateAccountPasswordReturn
}
