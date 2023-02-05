import { DbAddAccount } from '../../../data/usecases/add-account/db-add-account'
import { BcryptAdapter } from '../../../infra/criptography/bcrypt-adapter'
import { AccountPostgresRepository } from '../../../infra/db/postgres/account-repository/account'
import { LogPostgresRepository } from '../../../infra/db/postgres/log-repository/log'
import { SignUpController } from '../../../presentation/controllers/signup/signup'
import { Controller } from '../../../presentation/protocols'
import { LogControllerDecorator } from '../../decorators/log'
import { makeSignUpValidation } from './signup-validation'

export const makeSignUpController = (): Controller => {
  const salt = 12
  const bcryptAdapter = new BcryptAdapter(salt)
  const accountPostgresRepository = new AccountPostgresRepository()
  const dbAddAccount = new DbAddAccount(bcryptAdapter, accountPostgresRepository)
  const signUpController = new SignUpController(dbAddAccount, makeSignUpValidation())
  const logPostgresRepository = new LogPostgresRepository()

  return new LogControllerDecorator(signUpController, logPostgresRepository)
}
