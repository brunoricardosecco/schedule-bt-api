import { AccountModel, AddAccount, AddAccountModel, AddAccountRepository, Hasher } from './db-add-account.protocols'
export class DbAddAccount implements AddAccount {
  constructor (
    private readonly hasher: Hasher,
    private readonly dbAddAccountRepository: AddAccountRepository
  ) {}

  async add (accountData: AddAccountModel): Promise<AccountModel> {
    const hashedPassword = await this.hasher.hash(accountData.hashedPassword)

    const account = await this.dbAddAccountRepository.add(Object.assign({}, accountData, { password: hashedPassword }))

    return account
  }
}
