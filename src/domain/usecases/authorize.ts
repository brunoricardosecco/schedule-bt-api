import { AccountModel } from '@/domain/models/account'
import { Role } from '@/domain/models/role'

export interface IAuthorize {
  authorize: (user: AccountModel, authorizedRoles: Role[]) => Promise<boolean>
}
