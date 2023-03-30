import { FindCourtByIdAndCompanyId } from '@/data/usecases/find-court-by-id-and-company-id/find-court-by-id-and-company-id'
import { CourtPostgresRepository } from '@/infra/db/postgres/court/court-postgres-repository'

export const findCourtByIdAndCompanyIdFactory = (): FindCourtByIdAndCompanyId => {
  const courtPostgresRepository = new CourtPostgresRepository()

  return new FindCourtByIdAndCompanyId(courtPostgresRepository)
}
