import { DbAddAccount } from '@/data/usecases/add-account/db-add-account'
import { AddAccount } from '@/domain/usecases/add-account'
import { BcryptAdapter } from '@/infra/criptography/bcrypt-adapter/bcrypt-adapter'
import { AccountPostgresRepository } from '@/infra/db/postgres/account/account-prostgres-repository'

export const makeDbAddAccount = (): AddAccount => {
  const salt = 12
  const bcryptAdapter = new BcryptAdapter(salt)
  const accountPostgresRepository = new AccountPostgresRepository()

  return new DbAddAccount(bcryptAdapter, accountPostgresRepository)
}
