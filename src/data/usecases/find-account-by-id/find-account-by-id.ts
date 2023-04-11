import {
  AccountModel,
  AccountModelWithoutPassword,
  IFindAccountById,
  LoadAccountByIdRepository,
} from './find-account-by-id.protocols'

export class FindAccountById implements IFindAccountById {
  constructor(private readonly loadAccountByIdRepository: LoadAccountByIdRepository) {}

  async findById(accountId: string): Promise<AccountModelWithoutPassword> {
    const account = (await this.loadAccountByIdRepository.loadById(accountId)) as AccountModel
    const { hashedPassword, ...accountWithoutPassword } = account
    return { ...accountWithoutPassword }
  }
}
