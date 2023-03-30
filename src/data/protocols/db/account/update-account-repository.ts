import { AccountModel } from '@/domain/models/account'

export type UpdateAccountRepositoryModel = {
  hashedPassword?: string
}

export interface UpdateAccountRepository {
  update: (userId: string, accountData: UpdateAccountRepositoryModel) => Promise<AccountModel>
}
