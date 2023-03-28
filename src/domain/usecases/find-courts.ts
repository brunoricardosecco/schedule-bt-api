import { Court } from '@/domain/models/court'

export type FindCourtsParams = {
  userId?: string
}

export type FindCourtsReturn = Promise<Court[] | Error>

export interface IFindCourts {
  findMany: ({ userId }: FindCourtsParams) => FindCourtsReturn
}
