import { Role } from '@/domain/models/role'

export interface IAuthorize {
  authorize: (userId: string, authorizedRoles: Role[]) => Promise<boolean | Error>
}
