import { UpdateAccountPassword } from '@/data/usecases/update-account-password/update-account-password'
import { IUpdateAccountPassword } from '@/domain/usecases/update-account-password'
import { BcryptAdapter } from '@/infra/criptography/bcrypt-adapter/bcrypt-adapter'
import { AccountPostgresRepository } from '@/infra/db/postgres/account/account-postgres-repository'

export const updateAccountPasswordFactory = (): IUpdateAccountPassword => {
  const salt = 12
  const bcryptAdapter = new BcryptAdapter(salt)
  const accountPostgresRepository = new AccountPostgresRepository()

  return new UpdateAccountPassword(bcryptAdapter, accountPostgresRepository)
}
