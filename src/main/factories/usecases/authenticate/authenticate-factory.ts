import { Authenticate } from '@/data/usecases/authenticate/authenticate'
import { IAuthenticate } from '@/domain/usecases/authenticate'
import { JWTAdapter } from '@/infra/criptography/jwt-adapter/jwt-adapter'
import { AccountPostgresRepository } from '@/infra/db/postgres/account/account-postgres-repository'

export const makeAuthenticate = (): IAuthenticate => {
  const secret = process.env.SECRET ?? 'secret'
  const decrypter = new JWTAdapter(secret)
  const accountPostgresRepository = new AccountPostgresRepository()

  return new Authenticate(decrypter, accountPostgresRepository)
}
