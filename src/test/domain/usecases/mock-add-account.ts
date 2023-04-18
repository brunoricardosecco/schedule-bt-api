import { AccountModel } from '@/domain/models/account'
import { AddAccount, AddAccountModel } from '@/domain/usecases/add-account'
import { mockAccount } from '../models/mock-account'

export const mockAddAccount = (): AddAccount => {
  class AddAccountStub implements AddAccount {
    async add(account: AddAccountModel): Promise<AccountModel> {
      return await Promise.resolve(mockAccount())
    }
  }

  return new AddAccountStub()
}
