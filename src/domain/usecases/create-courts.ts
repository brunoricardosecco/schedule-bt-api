export type CreateCourtModel = {
  name: string
}

export type CreateCourtsReturn = Promise<number>

export interface ICreateCourts {
  create: (companyId: string, courts: CreateCourtModel[]) => CreateCourtsReturn
}
