import { AddAccountRepository, AddAccountToRepository } from '@/data/protocols/db/account/add-account-repository'
import { LoadAccountByEmailRepository } from '@/data/protocols/db/account/load-account-by-email-repository'
import { LoadAccountByIdRepository } from '@/data/usecases/authorize/authorize.protocols'
import { AccountModel } from '@/domain/models/account'
import { db } from '@/infra/db/orm/prisma'

export class AccountPostgresRepository implements AddAccountRepository, LoadAccountByEmailRepository, LoadAccountByIdRepository {
  async add (accountData: AddAccountToRepository): Promise<AccountModel> {
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

  async loadById (id: string): Promise<AccountModel | null> {
    const account = await db.accounts.findFirst({
      where: {
        id
      }
    })

    return account
  }
}
