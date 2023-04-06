import { DeleteCourtById } from '@/data/usecases/delete-court-by-id/delete-court-by-id'
import { CourtPostgresRepository } from '@/infra/db/postgres/court/court-postgres-repository'

export const deleteCourtByIdFactory = (): DeleteCourtById => {
  const courtPostgresRepository = new CourtPostgresRepository()

  return new DeleteCourtById(courtPostgresRepository, courtPostgresRepository)
}
