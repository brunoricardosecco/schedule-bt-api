import { RoleEnum } from '@/domain/enums/role-enum'
import {
  AccountModel,
  AddAccount,
  AddAccountModel,
  AddAccountRepository,
  Hasher,
  LoadAccountByEmailRepository,
} from './db-add-account.protocols'

export class DbAddAccount implements AddAccount {
  constructor(
    private readonly hasher: Hasher,
    private readonly addAccountRepository: AddAccountRepository,
    private readonly loadAccountByEmailRepository: LoadAccountByEmailRepository
  ) {}

  async add(accountData: AddAccountModel): Promise<AccountModel | Error> {
    if (accountData.role !== RoleEnum.EMPLOYEE && accountData.role !== RoleEnum.COMPANY_ADMIN) {
      return new Error('Role must be EMPLOYEE or COMPANY_ADMIN')
    }

    const isEmailAlreadyUsed = await this.loadAccountByEmailRepository.loadByEmail(accountData.email)

    if (isEmailAlreadyUsed) {
      return new Error('Email already being used')
    }

    const hashedPassword = await this.hasher.hash(accountData.password)

    const account = await this.addAccountRepository.add({
      hashedPassword,
      name: accountData.name,
      email: accountData.email,
      companyId: accountData.companyId,
      role: accountData.role,
    })

    return account
  }
}
