import { Court } from '@/domain/models/court'

export type FindManyCourtsParamsToRepository = {
  companyId: string
}

export interface FindManyCourtsRepository {
  findMany: ({ companyId }: FindManyCourtsParamsToRepository) => Promise<Court[]>
}
