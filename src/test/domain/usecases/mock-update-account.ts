import { IUpdateAccount, UpdateAccountReturn } from '@/domain/usecases/update-account'
import { mockAccount } from '../models/mock-account'

export const mockUpdateAccount = (): IUpdateAccount => {
  class UpdateAccountStub implements IUpdateAccount {
    async update(): UpdateAccountReturn {
      return Promise.resolve(mockAccount())
    }
  }

  return new UpdateAccountStub()
}
