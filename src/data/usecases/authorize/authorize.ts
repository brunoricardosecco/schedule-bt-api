import { AccountModel, IAuthorize, Role } from './authorize.protocols'

export class Authorize implements IAuthorize {
  async authorize(user: AccountModel, authorizedRoles: Role[]): Promise<boolean> {
    if (user.role === 'GENERAL_ADMIN') {
      return true
    }

    const isUserAuthorized = authorizedRoles.some(authorizedRole => authorizedRole === user.role)

    return isUserAuthorized
  }
}
