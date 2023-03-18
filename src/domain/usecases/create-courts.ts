export type CreateCourtModel = {
  name: string
}

export type CreateCourtReturn = Promise<number | Error>

export interface ICreateCourts {
  create: (userId: string, courts: CreateCourtModel[]) => CreateCourtReturn
}
