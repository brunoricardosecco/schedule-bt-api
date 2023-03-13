import { AuthenticateByPassword } from '@/data/usecases/authenticate-by-password/authenticate-by-password'
import { IAuthenticateByPassword } from '@/domain/usecases/authenticate-by-password'
import { BcryptAdapter } from '@/infra/criptography/bcrypt-adapter/bcrypt-adapter'
import { JWTAdapter } from '@/infra/criptography/jwt-adapter/jwt-adapter'
import { AccountPostgresRepository } from '@/infra/db/postgres/account/account-postgres-repository'

export const makeAuthenticateByPassword = (): IAuthenticateByPassword => {
  const salt = 12
  const secret = process.env.SECRET ?? 'secret'
  const loadAccountByEmailRepository = new AccountPostgresRepository()
  const hashComparer = new BcryptAdapter(salt)
  const encrypter = new JWTAdapter(secret)

  return new AuthenticateByPassword(loadAccountByEmailRepository, hashComparer, encrypter)
}
