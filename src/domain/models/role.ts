import { RoleEnum } from '../enums/role-enum'

export type Role = (typeof RoleEnum)[keyof typeof RoleEnum]
