import { AddAccountRepository } from '@/data/protocols/db/account/add-account-repository'
import { LoadAccountByEmailRepository } from '@/data/protocols/db/account/load-account-by-email-repository'
import { AccountModel } from '@/domain/models/account'
import { AddAccountModel } from '@/domain/usecases/add-account'
import { db } from '@/infra/db/orm/prisma'

export class AccountPostgresRepository implements AddAccountRepository, LoadAccountByEmailRepository {
  async add (accountData: AddAccountModel): Promise<AccountModel> {
    const account = await db.accounts.create({
      data: accountData
    })
    return account
  }

  async loadByEmail (email: string): Promise<AccountModel | null> {
    const account = await db.accounts.findFirst({
      where: {
        email
      }
    })
    return account
  }
}
