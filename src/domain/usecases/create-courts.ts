export type CreateCourtModel = {
  name: string
  companyId: string
}

export type CreateCourtReturn = Promise<number | Error>

export interface ICreateCourts {
  create: (courts: CreateCourtModel[]) => CreateCourtReturn
}
