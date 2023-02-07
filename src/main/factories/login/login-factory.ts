import { DbAuthentication } from '../../../data/usecases/authentication/db-authentication'
import { BcryptAdapter } from '../../../infra/criptography/bcrypt-adapter/bcrypt-adapter'
import { JWTAdapter } from '../../../infra/criptography/jwt-adapter/jwt-adapter'
import { AccountPostgresRepository } from '../../../infra/db/postgres/account/account-prostgres-repository'
import { LogPostgresRepository } from '../../../infra/db/postgres/log/log-postgres-repository'
import { LoginController } from '../../../presentation/controllers/login/login-controller'
import { Controller } from '../../../presentation/protocols'
import { LogControllerDecorator } from '../../decorators/log-controller-decorator'
import { makeLoginValidation } from './login-validation-factory'

export const makeLoginController = (): Controller => {
  const salt = 12
  const secret = process.env.SECRET ?? 'secret'
  const loadAccountByEmailRepository = new AccountPostgresRepository()
  const logPostgresRepository = new LogPostgresRepository()
  const hashComparer = new BcryptAdapter(salt)
  const encrypter = new JWTAdapter(secret)
  const dbAuthentication = new DbAuthentication(loadAccountByEmailRepository, hashComparer, encrypter)
  const loginController = new LoginController(dbAuthentication, makeLoginValidation())

  return new LogControllerDecorator(loginController, logPostgresRepository)
}
