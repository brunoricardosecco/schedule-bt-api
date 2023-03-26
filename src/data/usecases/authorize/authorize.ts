import {
  IAuthorize,
  Role,
  AccountModel
} from './authorize.protocols'

export class Authorize implements IAuthorize {
  async authorize (user: AccountModel, authorizedRoles: Role[]): Promise<boolean | Error> {
    if (user.role === 'GENERAL_ADMIN') {
      return true
    }

    const isUserAuthorized = authorizedRoles.some((authorizedRole) => authorizedRole === user.role)

    return isUserAuthorized
  }
}
