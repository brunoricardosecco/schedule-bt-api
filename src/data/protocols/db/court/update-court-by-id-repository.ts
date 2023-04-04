import { Court } from '@/domain/models/court'

export type UpdateCourtModelToRepository = {
  name?: string
}

export type UpdateCourtByIdParamsToRepository = {
  id: string
  data: UpdateCourtModelToRepository
}

export interface UpdateCourtByIdRepository {
  updateById: ({ id, data }: UpdateCourtByIdParamsToRepository) => Promise<Court>
}
