import { Court } from '../models/court'

export type UpdateCourtByIdModel = {
  name?: string
}

export type UpdateCourtByIdParams = {
  id: string
  companyId: string,
  data: UpdateCourtByIdModel
}

export interface IUpdateCourtById {
  updateById: ({ id, companyId, data }: UpdateCourtByIdParams) => Promise<Court | Error>
}
