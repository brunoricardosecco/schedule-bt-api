import { Court } from '@/domain/models/court'

export type FindManyCourtsParams = {
  userId?: string
}

export type FindManyCourtsReturn = Promise<Court[] | Error>

export interface IFindManyCourts {
  findMany: ({ userId }: FindManyCourtsParams) => FindManyCourtsReturn
}
