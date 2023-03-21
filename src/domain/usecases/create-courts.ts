export type CreateCourtModel = {
  name: string
}

export type CreateCourtsReturn = Promise<number | Error>

export interface ICreateCourts {
  create: (userId: string, courts: CreateCourtModel[]) => CreateCourtsReturn
}
