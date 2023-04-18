import { AccountModel } from '@/domain/models/account'
import { IFindAccountById } from '@/domain/usecases/find-account-by-id'
import { mockAccount } from '../models/mock-account'

export const mockFindAccountById = (): IFindAccountById => {
  class FindAccountByIdStub implements IFindAccountById {
    async findById(accountId: string): Promise<AccountModel> {
      return await Promise.resolve(mockAccount())
    }
  }

  return new FindAccountByIdStub()
}
