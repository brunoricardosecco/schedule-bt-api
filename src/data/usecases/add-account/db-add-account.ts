import { AccountModel, AddAccount, AddAccountModel, AddAccountRepository, Hasher } from './db-add-account.protocols'
export class DbAddAccount implements AddAccount {
  private readonly hasher: Hasher
  private readonly dbAddAccountRepository: AddAccountRepository

  constructor (hasher: Hasher, dbAddAccountRepository: AddAccountRepository) {
    this.hasher = hasher
    this.dbAddAccountRepository = dbAddAccountRepository
  }

  async add (accountData: AddAccountModel): Promise<AccountModel> {
    const hashedPassword = await this.hasher.hash(accountData.password)

    const account = await this.dbAddAccountRepository.add(Object.assign({}, accountData, { password: hashedPassword }))

    return account
  }
}
