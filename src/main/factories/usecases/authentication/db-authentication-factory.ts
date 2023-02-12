import { DbAuthentication } from '../../../../data/usecases/authentication/db-authentication'
import { Authentication } from '../../../../domain/usecases/authentication'
import { BcryptAdapter } from '../../../../infra/criptography/bcrypt-adapter/bcrypt-adapter'
import { JWTAdapter } from '../../../../infra/criptography/jwt-adapter/jwt-adapter'
import { AccountPostgresRepository } from '../../../../infra/db/postgres/account/account-prostgres-repository'

export const makeDbAuthentication = (): Authentication => {
  const salt = 12
  const secret = process.env.SECRET ?? 'secret'
  const loadAccountByEmailRepository = new AccountPostgresRepository()
  const hashComparer = new BcryptAdapter(salt)
  const encrypter = new JWTAdapter(secret)

  return new DbAuthentication(loadAccountByEmailRepository, hashComparer, encrypter)
}
