import { DbAddAccount } from '../../data/usecases/AddAccount/db-add-account'
import { BcryptAdapter } from '../../infra/criptography/bcrypt-adapter'
import { AccountPostgresRepository } from '../../infra/db/postgres/account-repository/account'
import { SignUpController } from '../../presentation/controllers/signup/signup'
import { EmailValidatorAdapter } from '../../utils/email-validator-adapter'

export const makeSignUpController = (): SignUpController => {
  const salt = 12
  const emailValidatorAdapter = new EmailValidatorAdapter()
  const bcryptAdapter = new BcryptAdapter(salt)
  const accountPostgresRepository = new AccountPostgresRepository()
  const dbAddAccount = new DbAddAccount(bcryptAdapter, accountPostgresRepository)

  return new SignUpController(emailValidatorAdapter, dbAddAccount)
}
