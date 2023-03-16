import { Role } from '../models/role'

export interface IAuthorize {
  authorize: (userId: string, authorizedRoles: Role[]) => Promise<boolean | Error>
}
