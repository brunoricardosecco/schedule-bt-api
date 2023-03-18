import { Court } from '@/domain/models/court'

export type CreateCourtModel = {
  name: string
  companyId: string
}

export type CreateCourtReturn = Promise<Court | Error>

export interface ICreateCourts {
  create: (courts: CreateCourtModel[]) => CreateCourtReturn
}
