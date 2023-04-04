import { UpdateCourtById } from '@/data/usecases/update-court-by-id/update-court-by-id'
import { CourtPostgresRepository } from '@/infra/db/postgres/court/court-postgres-repository'

export const updateCourtByIdFactory = (): UpdateCourtById => {
  const courtPostgresRepository = new CourtPostgresRepository()

  return new UpdateCourtById(courtPostgresRepository, courtPostgresRepository)
}
