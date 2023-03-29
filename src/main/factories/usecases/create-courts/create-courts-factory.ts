import { CreateCourts } from '@/data/usecases/create-courts/create-courts'
import { CourtPostgresRepository } from '@/infra/db/postgres/court/court-postgres-repository'

export const createCourtsFactory = (): CreateCourts => {
  const courtPostgresRepository = new CourtPostgresRepository()

  return new CreateCourts(courtPostgresRepository)
}
