import { AddAccountRepository, AddAccountToRepository } from '@/data/protocols/db/account/add-account-repository'
import { LoadAccountByEmailRepository } from '@/data/protocols/db/account/load-account-by-email-repository'
import { AccountModel } from '@/domain/models/account'
import { db } from '@/infra/db/orm/prisma'

export class AccountPostgresRepository implements AddAccountRepository, LoadAccountByEmailRepository {
  async add (accountData: AddAccountToRepository): Promise<AccountModel> {
    const account = await db.accounts.create({
      data: accountData
    })

    return {
      ...account,
      company: null
    }
  }

  async loadByEmail (email: string): Promise<AccountModel | null> {
    const account = await db.accounts.findFirst({
      where: {
        email
      }
    })

    if (!account) {
      return null
    }

    return {
      ...account,
      company: null
    }
  }
}
