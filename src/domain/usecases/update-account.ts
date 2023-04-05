import { AccountModel } from '@/domain/models/account'

export type UpdateAccountReturn = Promise<AccountModel | Error>

export type UpdateAccountParams = {
  name?: string
  password?: string
}

export interface IUpdateAccount {
  update: (userId: string, params: UpdateAccountParams) => UpdateAccountReturn
}
