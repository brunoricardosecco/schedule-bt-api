import { AccountModel } from '@/domain/models/account'

export interface IAuthenticate {
  auth: (token: string) => Promise<AccountModel | Error>
}
