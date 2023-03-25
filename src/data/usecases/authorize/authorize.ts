import {
  LoadAccountByIdRepository,
  IAuthorize,
  Role
} from './authorize.protocols'

export class Authorize implements IAuthorize {
  constructor (
    private readonly accountRepository: LoadAccountByIdRepository
  ) {}

  async authorize (userId: string, authorizedRoles: Role[]): Promise<boolean | Error> {
    const user = await this.accountRepository.loadById(userId)

    if (!user) {
      return new Error('User not found')
    }

    const isUserAuthorized = authorizedRoles.some((authorizedRole) => authorizedRole === user.role)

    return isUserAuthorized
  }
}
