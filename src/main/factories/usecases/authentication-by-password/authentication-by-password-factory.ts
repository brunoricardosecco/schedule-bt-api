import { AuthenticationByPassword } from '@/data/usecases/authentication-by-password/authentication-by-password'
import { IAuthenticationByPassword } from '@/domain/usecases/authentication-by-password'
import { BcryptAdapter } from '@/infra/criptography/bcrypt-adapter/bcrypt-adapter'
import { JWTAdapter } from '@/infra/criptography/jwt-adapter/jwt-adapter'
import { AccountPostgresRepository } from '@/infra/db/postgres/account/account-postgres-repository'

export const makeAuthenticationByPassword = (): IAuthenticationByPassword => {
  const salt = 12
  const secret = process.env.SECRET ?? 'secret'
  const loadAccountByEmailRepository = new AccountPostgresRepository()
  const hashComparer = new BcryptAdapter(salt)
  const encrypter = new JWTAdapter(secret)

  return new AuthenticationByPassword(loadAccountByEmailRepository, hashComparer, encrypter)
}
