import { Court } from '@/domain/models/court'

export type FindCourtsParams = {
  companyId?: string
}

export type FindCourtsReturn = Promise<Court[] | Error>

export interface IFindCourts {
  findMany: ({ companyId }: FindCourtsParams) => FindCourtsReturn
}
