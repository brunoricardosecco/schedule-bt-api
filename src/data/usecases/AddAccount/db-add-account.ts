import { AddAccount, AddAccountModel, AddAccountRepository, Encrypter } from './db-add-account.protocols'
export class DbAddAccount implements AddAccount {
  private readonly encrypter: Encrypter
  private readonly dbAddAccountRepository: AddAccountRepository

  constructor (encrypter, dbAddAccountRepository) {
    this.encrypter = encrypter
    this.dbAddAccountRepository = dbAddAccountRepository
  }

  async add (accountData: AddAccountModel): Promise<any> {
    const hashedPassword = await this.encrypter.encrypt(accountData.password)

    await this.dbAddAccountRepository.add(Object.assign({}, accountData, { password: hashedPassword }))

    return await new Promise(resolve => { resolve(null) })
  }
}
