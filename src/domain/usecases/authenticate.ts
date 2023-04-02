import { AccountModel } from '@/domain/models/account'

export interface IAuthenticateReturn {
  user: AccountModel
}

export interface IAuthenticate {
  auth: (token: string) => Promise<IAuthenticateReturn | Error>
}
