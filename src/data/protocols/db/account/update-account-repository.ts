import { AccountModel } from '@/domain/models/account'

export type UpdateAccountRepositoryModel = {
  hashedPassword?: string
}

export interface UpdateAccountRepository {
  update: (accountData: UpdateAccountRepositoryModel) => Promise<AccountModel>
}
