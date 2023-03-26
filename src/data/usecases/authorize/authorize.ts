import {
  IAuthorize,
  Role,
  AccountModel
} from './authorize.protocols'

export class Authorize implements IAuthorize {
  async authorize (user: AccountModel, authorizedRoles: Role[]): Promise<boolean | Error> {
    const isUserAuthorized = authorizedRoles.some((authorizedRole) => authorizedRole === user.role)

    return isUserAuthorized
  }
}
