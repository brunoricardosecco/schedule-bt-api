import { FindManyCourts } from '@/data/usecases/find-many-courts/find-many-courts'
import { CourtPostgresRepository } from '@/infra/db/postgres/court/court-postgres-repository'
import { AccountPostgresRepository } from '@/infra/db/postgres/account/account-postgres-repository'

export const findManyCourtsFactory = (): FindManyCourts => {
  const accountPostgresRepository = new AccountPostgresRepository()
  const courtPostgresRepository = new CourtPostgresRepository()

  return new FindManyCourts(accountPostgresRepository, courtPostgresRepository)
}
