export type CreateCourtModelToRepository = {
  name: string
  companyId: string
}

export interface CreateCourtsRepository {
  createMany: (courts: CreateCourtModelToRepository[]) => Promise<number>
}
