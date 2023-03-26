import { Role } from '@/domain/models/role'
import { AccountModel } from '@/domain/models/account'

export interface IAuthorize {
  authorize: (user: AccountModel, authorizedRoles: Role[]) => Promise<boolean | Error>
}
