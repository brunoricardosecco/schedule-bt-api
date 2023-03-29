import { Court } from '@/domain/models/court'

export type FindCourtsParamsToRepository = {
  companyId?: string
}

export interface FindCourtsRepository {
  findMany: ({ companyId }: FindCourtsParamsToRepository) => Promise<Court[]>
}
