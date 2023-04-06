import { UpdateAccount } from '@/data/usecases/update-account/update-account'
import { IUpdateAccount } from '@/domain/usecases/update-account'
import { BcryptAdapter } from '@/infra/criptography/bcrypt-adapter/bcrypt-adapter'
import { AccountPostgresRepository } from '@/infra/db/postgres/account/account-postgres-repository'

export const updateAccountFactory = (): IUpdateAccount => {
  const salt = 12
  const bcryptAdapter = new BcryptAdapter(salt)
  const accountPostgresRepository = new AccountPostgresRepository()

  return new UpdateAccount(bcryptAdapter, accountPostgresRepository)
}
