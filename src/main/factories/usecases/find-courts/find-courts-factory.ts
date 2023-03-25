import { FindCourts } from '@/data/usecases/find-courts/find-courts'
import { CourtPostgresRepository } from '@/infra/db/postgres/court/court-postgres-repository'
import { AccountPostgresRepository } from '@/infra/db/postgres/account/account-postgres-repository'

export const findManyCourtsFactory = (): FindCourts => {
  const accountPostgresRepository = new AccountPostgresRepository()
  const courtPostgresRepository = new CourtPostgresRepository()

  return new FindCourts(accountPostgresRepository, courtPostgresRepository)
}
