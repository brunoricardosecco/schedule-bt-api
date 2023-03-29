import { FindCourts } from '@/data/usecases/find-courts/find-courts'
import { CourtPostgresRepository } from '@/infra/db/postgres/court/court-postgres-repository'

export const findManyCourtsFactory = (): FindCourts => {
  const courtPostgresRepository = new CourtPostgresRepository()

  return new FindCourts(courtPostgresRepository)
}
