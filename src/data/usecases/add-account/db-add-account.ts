import { AccountModel, AddAccount, AddAccountModel, AddAccountRepository, Encrypter } from './db-add-account.protocols'
export class DbAddAccount implements AddAccount {
  private readonly encrypter: Encrypter
  private readonly dbAddAccountRepository: AddAccountRepository

  constructor (encrypter, dbAddAccountRepository) {
    this.encrypter = encrypter
    this.dbAddAccountRepository = dbAddAccountRepository
  }

  async add (accountData: AddAccountModel): Promise<AccountModel> {
    const hashedPassword = await this.encrypter.encrypt(accountData.password)

    const account = await this.dbAddAccountRepository.add(Object.assign({}, accountData, { password: hashedPassword }))

    return account
  }
}
